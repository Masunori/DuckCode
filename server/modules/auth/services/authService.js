import db from '../../../models/index.js';
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import redis from '../../../utils/redisClient.js';
import jwt from 'jsonwebtoken';

const authService = {
    async logInService(email, password) {
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
        }
    },
    
    async registerService(userData) {
        const {username, password, email, confirmPassword} = userData;
        const user = await db.User.findOne({
            where: {
                [Op.or]: [
                    {email: email}, 
                    {name: username}
                ]
            }
        })
        if(password != confirmPassword) {
            throw new Error('Password and confirmed password are not matched');
        }
        if(user && user.isAuthenticated) {
            const errors = [];
            if(user.email === email) {
                errors.push('Email has been registered');
            }
            if(user.name === username) {
                errors.push('Username has been registered');
            }
            if(errors.length > 0) {
                throw new Error(errors.join(', '));
            }
        }
        if(password !== confirmPassword) {
            throw new Error('Password and confirmed password are not matched');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        if(user) {
            await user.update({
                name: username, 
                password: hashedPassword,
                isAuthenticated: false
            })
        }
        else {
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
                profilePicture: '',
                userPreferences: ''
            });
        }
        return {
            message: "Registered successfully",
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
        const otp = await this.genOTP();
        // if user want to request that use to resend, then we need delete the old one first
        await redis.del(email);
        await redis.set(email, otp, 'EX', 300);
        await this.sendEmail(email, otp);
    },
    async verifyOTP(email, otp) {        
        const storedOtp = await redis.get(email);
        if (storedOtp !== otp || !storedOtp) {
            throw new Error('Invalid OTP or OTP expired');
        }
        await redis.del(email); // Clear OTP after successful verification
        return {
            message: 'Email verified successfully'
        }
    },
    async resetPassword(email, newPassword) {
        const user = await db.User.findOne({
            where: { email: email }
        });
        if (!user) {
            throw new Error('User not found');
        };
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return {
            message: 'Password reset successfully'
        };
    },
    // authService.js
    async refreshTokenService(refreshToken) {
        try {
            console.log('Verifying refresh token...');
            
            // Verify the refresh token
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
            console.log('Token decoded, user ID:', decoded.userid);
            
            // Get user from database
            const user = await db.User.findByPk(decoded.userid);
            if (!user) {
            throw new Error('User not found');
            }
            
            console.log('User found:', user.name);
            
            // ✅ FIX: Use different variable names to avoid conflict
            const newAccessToken = jwt.sign(
            { userid: user.userid },  // ✅ Use userid, not id
            process.env.JWT_SECRET, 
            { expiresIn: '1m' }  // ✅ Changed to 1m (was 1h)
            );
            
            const newRefreshToken = jwt.sign(
            { userid: user.userid },  // ✅ Use userid, not id
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
            );

            console.log('New tokens generated successfully');

            return { 
            token: { 
                accessToken: newAccessToken,
                refreshToken: newRefreshToken 
            } 
            };
        } catch (error) {
            console.error('Error during token refresh:', error.message);
            throw new Error('Failed to refresh token: ' + error.message);
        }
    }
    // async logoutService(userid) {
    //     const user = await db.User.findByPk(userid);
    //     if (!user) {
    //         throw new Error('User not found');
    //     };
    //     // Invalidate tokens if stored server-side (e.g., in a database or cache)

    // }
};

export default authService;