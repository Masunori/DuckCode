import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';
import passport from './modules/oauth/index.js';  // ✅ Import OAuth configuration
import router from './routes/api.js';

dotenv.config();
const app = express();
app.disable("x-powered-by");

app.use(express.json());
app.use(cookieParser());

// ✅ Enhanced CORS setup for allowed origins and ngrok domains
// const allowedOrigins = [
//   "https://lynwood-loreless-consubstantially.ngrok-free.app",
//   process.env.FRONTEND_URL || "",
// ];
app.set('trust proxy', 1)
// Update your app.js
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      "https://lynwood-loreless-consubstantially.ngrok-free.app", // Your frontend
      "https://min-nondetrimental-lillia.ngrok-free.app",         // Your API (for development tools)
      process.env.FRONTEND_URL || ""
    ];
    
    // Check if origin is allowed or is any ngrok domain
    if (allowedOrigins.includes(origin) || origin.endsWith('.ngrok-free.app')) {
      console.log('CORS allowed for origin:', origin);
      callback(null, true);
    } else {
      console.warn('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"], // Add this if you're sending custom headers back
  credentials: true
}));
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if ((origin && allowedOrigins.indexOf(origin) !== -1) || !origin) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true, // Enable credentials (cookies, authorization headers)
//     optionsSuccessStatus: 200,
//   })
// );

// ✅ (Optional) Express-session setup, if you're using sessions
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'your_secret',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: false, // Set true if using HTTPS
//     httpOnly: true,
//     maxAge: 1000 * 60 * 60 * 24 // 1 day
//   }
// }));

// ✅ Passport initialization (required for OAuth)
app.use(passport.initialize());
console.log('✅ Passport initialized');

// ✅ Your API routes
app.use("/", router);

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});