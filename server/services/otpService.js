import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { redisClient } from '../config/redis.js';

async function genOTP(length = 6) {
    return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
}

async function sendEmail(email, otp) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'OTP for email verification',
        text: `Your OTP is: ${otp}, valid for 5 minutes.`,
    };

    return transporter.sendMail(mailOptions);
}

export async function sendOTPForEmail(req, res) {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const otp = await genOTP();

        // Store OTP in Redis with expiration (5 minutes = 300 seconds)
        await redisClient.setEx(email, 300, otp); // store otp and email into redis

        // Send OTP email
        await sendEmail(email, otp);

        res.json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error('Error sending OTP:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function verifyOTPForEmail(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Missing required fields: email, otp' });
        }

        const storedOTP = await redisClient.get(email);

        if (!storedOTP) {
            return res.status(400).json({ error: 'OTP expired or invalid' });
        }

        if (storedOTP !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // delete otp after verification 
        await redisClient.del(email);

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
