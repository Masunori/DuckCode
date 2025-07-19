import db from '../../../models/index.js';
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import redis from '../../../utils/redisClient.js';
import jwt from 'jsonwebtoken';

const authService = {
    async logInService(email, password) {
        // Logic for logging in the user
        const user = await db.User.findOne({
            where: {
                [Op.and]: [
                    { email: email },
                    { isAuthenticated: true}
                ]
            }
        });
        if (!user) {
            throw new Error('Email or password is not corrected');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            throw new Error('Email or password is not corrected');
        }
        
        // TODO: Generate JWT tokens (currently placeholder)
        const accessToken = jwt.sign({ userid: user.userid }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
                profilePicture: user.profilePicture
            },
            token: {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        }
    },
    
    async registerService(userData) {
        // username, password, email, confirmedpassword
        const {username, password, email, confirmPassword} = userData;
        const user = await db.User.findOne({
            where: {
                [Op.or]: [
                    {email: email}, 
                    {name: username}
                ]
            }
        })
        if(user) {
            throw new Error('Email or username have been registered');
        }
        if(password !== confirmPassword) {
            throw new Error('Password and confirmed password are not matched');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.User.create({
            name: username,
            email: email,
            password: hashedPassword,
            exp: 0,
            rankPoint: 0,
            provider: 'local',
            providerId: null,
            isAuthenticated: false,
            bio: '',
            isTwoFactored: false,
            profilePicture: ''
        });
        return {
            message: "User created. Please verify your email with OTP.",
            email: email
        };
    },
    async genOTP() {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        return otp;
    },
    async sendEmail(email, otp) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "OTP for email vertification",
            text: `Your OTP is: ${otp}, valid for 5 minutes.`,
        };
        return transporter.sendMail(mailOptions);
    },
    async requestOTP(email) {
        const user = await db.User.findOne({
            where: { [Op.and]: [{ email: email }, { isAuthenticated: false }] }
        });
        if(!user) {
            throw new Error('User not found or already authenticated');
        }
        const otp = await this.genOTP();
        await redis.set(email, otp, 'EX', 300); 
        await this.sendEmail(email, otp);
    },
    async verifyOTP(email, otp) {
        const storedOtp = await redis.get(email);
        if (storedOtp !== otp || !storedOtp) {
            throw new Error('Invalid OTP or OTP expired');
        }
        const user = await db.User.findOne({
            where: { email: email }
        });
        if (!user) {
            throw new Error('User not found');
        }
        user.isAuthenticated = true;
        await user.save();
        await redis.del(email); // Clear OTP after successful verification
        return {
            message: 'Email verified successfully'
        }
    }
};

export default authService;