import {logIn as logInService, register as registerService} from '../services/userAuthen.js';
import { sendOTPForEmail as sendOTPService, verifyOTPForEmail as verifyOTPService  } from '../services/otpService.js';
export const logIn = async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) {
            return res.status(400).json({
                error: 'Missing required fields: username, password',
            });
        }
        await logInService(req, res);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const register = async (req, res) => {
    try {
        const { username, password, email} = req.body;
        if(!username || !password || !email) {
            return res.status(400).json({
                error: 'Missing required fields: username, password, email',
            });
        }
        await registerService(req, res);
    } catch(error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const sendEmail = async (req, res) => {
    try {
        const {email} = req.body;
        if(!email) {
            return res.status(400).json({
                error: 'Missing information about email bro',
            })
        }
        await sendOTPService(req, res);
    } catch(error) {
        console.error('Error: ', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
};

export const verifyOTP = async (req, res) => {
    try {
        await verifyOTPService(req, res);
    } catch(error) {
        console.error('Error: ', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
};