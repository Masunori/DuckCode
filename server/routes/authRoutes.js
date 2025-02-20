import express from 'express';
import passport from '../config/passport.js';
import { logIn, register, } from '../controllers/authController.js';
import { sendEmail, verifyOTP } from '../controllers/authController.js';

const router = express.Router();
router.post('/login', logIn);
router.post('/register', register);
// google oauth callback route
router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}));
// Google OAuth callback route
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", session: true }),
    (req, res) => {
      const token = req.user.token; 
      return res.json({message: "Log in sucessfully", token});
    }
  );
router.post('/sendOTP', sendEmail);
router.post('/verifyOTP', verifyOTP);
export default router;