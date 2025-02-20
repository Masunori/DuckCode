import express from 'express'; 
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport.js'; 
import authRoutes from './routes/authRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import codeRoutes from './routes/codeRoutes.js';

dotenv.config();
const app = express();

// middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Allow frontend to call backend
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());  

// Routes
app.use('/auth', authRoutes);
app.use('/question', questionRoutes);
app.use('/code', codeRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
