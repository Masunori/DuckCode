import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';
async function hashPassword(password) {
  return await bcrypt.hash(password, 10); // password + 10 salts rounds
}

async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

export async function logIn(req, res) {
    try {
        const { username, password } = req.body;
        const query = `SELECT * FROM users.account WHERE username = $1`;

        const { rows } = await pool.query(query, [username]);
        //console.log(rows);
        if (!rows.length) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        const user = rows[0];
        const isMatch = await comparePassword(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign({userId: user.account_id, username: user.username, email: user.email, rankPoint: user.rankPoint, level: user.level, experincePoint: user.exp}, process.env.JWT_SECRET, { expiresIn: '36h' }); 
        //console.log(jwtDecode(token));
        res.json({ message: 'Login successful', token});
    } catch(error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ error: error.message });
    }
}
export async function register(req, res) {
    try {
        const { username, password, email } = req.body;
        const checkUserExistedQuery = `SELECT * FROM users.account WHERE username = $1 OR email = $2`;
        const { rows } = await pool.query(checkUserExistedQuery, [username, email]);
        if(rows.length) {
            return res.status(400).json({ status: 'Username or email already existed' });
        }
        else {
            const hashedPassword = await hashPassword(password);
            const insertUserQuery = `INSERT INTO users.account (username, password, email) VALUES ($1, $2, $3)`;
            await pool.query(insertUserQuery, [username, hashedPassword, email]);
            res.json({ status: 'SUCCESS' }); // then back to login screen :) // việc của chú Duck
        }
    } catch(error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ status: error.message });
    }
}


