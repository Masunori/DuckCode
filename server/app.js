import express from 'express'; 
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport-factory.js'; // Import new factory-based Passport setup
import router from './routes/api.js';
import cookieParser from 'cookie-parser';
dotenv.config();
const app = express();
app.disable("x-powered-by");

app.use(express.json());
app.use(cookieParser());

// Middleware
app.use(cors({
    origin: "https://duck-code.vercel.app", // Allow frontend to call backend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))

app.options("https://duck-code.vercel.app", cors());

// Initialize Passport
//  
// app.use(passport.initialize());
// app.use(passport.session()); 
// Routes
app.use("/", router);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
