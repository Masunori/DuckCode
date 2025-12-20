import jwt from 'jsonwebtoken';
import db from '../../models/index.js';

const authenticated = async (req, res, next) => {
    // console.log("Request: ", req);
    console.log("Cookie (at middleware): ", req.headers.cookie);
    const cookieJson = JSON.parse(req.headers.cookie);
    console.log("Cookie JSON: ", cookieJson);
    const token = cookieJson ? cookieJson.accessToken : null;
    console.log("Token (at middleware): ", token);
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        const user = await db.User.findByPk(decoded.userid);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        console.log('Authenticated user:', user);
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        return res.status(401).json({ error: 'Invalid token' });
    }
}
export default authenticated;