import express from 'express';
import passport from '../config/passport-factory.js';
import { logIn, register, sendEmail, verifyOTP} from '../controllers/authController.js';

const router = express.Router();
router.post('/login', logIn);
router.post('/register', register);
// // google oauth callback route
router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}));
router.get("/google/callback",passport.authenticate("google", { failureRedirect: "/login", session: false }), 
    (req, res) => {
        const token = req.user.token;
        return res.json({message: "Log in successfully", token});
    }
);
router.get("/github", passport.authenticate("github", {scope: ["profile", "user:email"]}));
router.get("/github/callback", passport.authenticate("github", {failureRedirect: "/login", session: false }),
    (req, res) => {
        const token = req.user.token;
        return res.json({message: "Log in successfully", token});
    }
);

// Facebook OAuth routes
router.get("/facebook", passport.authenticate("facebook", {scope: ["email"]}));
router.get("/facebook/callback", passport.authenticate("facebook", {failureRedirect: "/login", session: false }),
    (req, res) => {
        const token = req.user.token;
        return res.json({message: "Log in successfully", token});
    }
);

router.post('/sendOTP', sendEmail);
router.post('/verifyOTP', verifyOTP);
export default router;