import passport from "passport"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import { pool } from "../config/db.js"
import dotenv from "dotenv"

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:4000/auth/google/callback" // this will get the value t
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const provider_id = profile.id;
                const provider = "google";
                const username = profile.displayName;

                // check for existed user
                const query =  `SELECT * FROM users.account WHERE provider_id = $1 AND provider = $2`;
                const { rows } = await pool.query(query, [provider_id, provider]);
                let user;
                if(rows.length === 0) {
                    const insertQuery = `INSERT INTO users.account (username, email, provider, provider_id) VALUES ($1, $2, $3, $4) RETURNING *`;
                    const result = await pool.query(insertQuery, [username, email, provider, provider_id]);
                    user = result.rows[0];
                }
                else {
                    user = rows[0];
                }
                 // Create JWT Token
                const token = jwt.sign({
                    userId: user.account_id,
                    username: user.username,
                    email: user.email,
                    rankPoints: user.rankpoints,
                    level: user.level,
                    experiencePoints: user.exp,},
                    process.env.JWT_SECRET,
                    { expiresIn: "36h" });
                user.token = token;
                return done(null, user)
            } catch(error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.account_id); // determine what data to store in the session (cookie)
});

passport.deserializeUser(async (id, done) => {
    try {
        const query = `SELECT * from users.account WHERE account_id = $1`;
        const {rows} = await pool.query(query, [id]);
        done(null, rows[0]);
    } catch (err) {
        done(err, null);
    }
});

export default passport;