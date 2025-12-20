
import db from "../../../models/index.js";           // ✅ Fixed path
import config from "../../../config/index.js";       // ✅ Fixed path
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { webcrypto } from 'node:crypto';              // ✅ Removed duplicate import

import emailService from "../services/emailService.js";

class BaseOAuthProvider {
  constructor(providerName) {
    this.providerName = providerName;
    
    if (this.constructor === BaseOAuthProvider) {
      throw new Error("BaseOAuthProvider is abstract and cannot be instantiated directly");
    }
  }
  
  // template method
  async processOAuthProfile(profile) {
    const userInfo = this.extractUserInfo(profile);
    console.log(`[${this.providerName} OAuth] Extracted user info:`, userInfo);
    let user = await this.findExistingUser(userInfo.email);
    console.log("Existing user found:", user);
    if (!user) {
      user = await this.createNewUser(userInfo);
    }
    const tokens = await this.generateTokens(user);
    console.log(`[${this.providerName} OAuth] Generated tokens for user:`, tokens);
    return tokens;
  }
  
  // abstract method to be implemented by subclasses
  extractUserInfo(profile) {
    throw new Error("extractUserInfo must be implemented by subclass");
  }
  
  // Default implementation that can be overridden
  async findExistingUser(email) {
    return await db.User.findOne({
      where: { email },
    });
  }
  
  async createNewUser(userInfo) {
    const { email, username, avatarUrl, provider } = userInfo;
    const password = this.generateRandomPassword(16);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.User.create({
      name: username,
      email: email,
      password: hashedPassword,
      exp: 0,
      rankPoint: 0,
      provider: provider,
      providerId: null,
      isAuthenticated: false,
      bio: '',
      isTwoFactored: false,
      profilePicture: avatarUrl || '',
      userPreferences: ''
    });
    // Send welcome email
    await emailService.sendWelcomeEmail(email, password);
    return await db.User.findOne({
      where: { userid: newUser.userid }
    });
  }
  
  async generateTokens(user) {  
    const accessToken = jwt.sign({ userid: user.userid }, process.env.JWT_SECRET, { expiresIn: '1m' });
    const refreshToken = jwt.sign({ userid: user.userid }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return {
      user: {
        userid: user.userid,
        name: user.name,
        email: user.email,
        exp: user.exp,
        rankPoint: user.rankPoint,
        bio: user.bio,
        isTwoFactored: user.isTwoFactored,
        profilePicture: user.profilePicture,
        userPreference: user.userPreferences || ''
      },
      token: {
        accessToken,
        refreshToken
      }
    };
  }
  
  generateRandomPassword(length) {
    const crypto = globalThis.crypto || webcrypto;
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    const special = "!@#$%^&*()-_=+[]{}|:,.<>?";
    const all = lower + upper + digits + special;
    
    const pwdArray = new Uint32Array(length);
    crypto.getRandomValues(pwdArray);
    
    return Array.from(pwdArray, n => all[n % all.length]).join("");
  }
}

export default BaseOAuthProvider;