import {logIn as logInService, register as registerService } from '../services/userAuthen.js';

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