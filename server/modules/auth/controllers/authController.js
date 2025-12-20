import user from '../../../models/user.js';
import authService from '../services/authService.js';
import db from '../../../models/index.js';
import { Op } from 'sequelize';

const PASSWORD_CONDITIONS = {
    hasTenCharOrMore: {
        name: 'At least 10 characters',
        checkFn: str => str.length >= 10
    },
    hasUppercase: {
        name: 'At least 1 uppercase letter',
        checkFn: str => /[A-Z]/.test(str)
    },
    hasLowercase: {
        name: 'At least 1 lowercase letter',
        checkFn: str => /[a-z]/.test(str)
    },
    hasDigit: {
        name: 'At least 1 numerical digit',
        checkFn: str => /\d/.test(str)
    },
    hasSpecialChar: {
        name: 'At least 1 special character: !, @, #, $, %, ^, &, *, ?',
        checkFn: str => /[!@#$%^&*?]/.test(str)
    },
    hasNoSpaces: {
        name: 'No space',
        checkFn: str => !/\s/.test(str)
    }
};

const USERNAME_CONDITIONS = {
    fiveToTwentyCharacters: {
        name: 'Between 5 and 30 characters',
        checkFn: str => str.length >= 5 && str.length <= 30
    },
    containsAllowedChars: {
        name: 'Only contains letters (from any language), numbers, underscores (_), dot (.) or hyphen (-)',
        checkFn: str => /^[\p{L}\p{N}_.-]+$/u.test(str)
    }
};
// helpers/validation.js (or top of this file)
const runConditions = (value, conditions) =>
  Object.entries(conditions).map(([key, rule]) => ({
    key,
    name: rule.name,
    ok: rule.checkFn(String(value ?? "")),
  }));

const failedRules = (value, conditions) =>
  runConditions(value, conditions).filter(r => !r.ok);

const authController = {
  async login(req, res) {
    const { email, password } = req.body;
    console.log("Email: ", email);
    console.log("Password: ", password);
    if(!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
      const loginData = await authService.logInService(email, password);
      console.log("Response for login: ", res);
      console.log('Response Headers:', res.getHeaders());
      // console.log('Set-Cookie Headers:', res.get('Set-Cookie'));
      return res.status(200).json({ message: 'Login successful', data: loginData.token });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  },
  async register(req, res) {
    const {userData} = req.body;
    const errors = [];
    if(!userData.email || !userData.password || !userData.confirmPassword || !userData.username) {
      errors.push('All fields are required');
    }
    const usernameValid = Object.values(USERNAME_CONDITIONS).every(rule =>
      rule.checkFn(userData?.username ?? '')
    );
    if (!usernameValid) {
      errors.push('Username is invalid');
    }
    const passwordValid = Object.values(PASSWORD_CONDITIONS).every(rule =>
      rule.checkFn(userData?.password ?? '')
    );
    if (!passwordValid) {
      errors.push('Password is invalid');
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/;
    if (!emailRegex.test(userData.email)) {
      errors.push('Email is invalid');
    }
    if(userData.username && userData.email) {
      const user = await db.User.findOne({
        where: {
          [Op.or]: [
            { email: userData.email },
            { name: userData.username },
          ]
        }
      });
      if(user && user.isAuthenticated) {
        if(user.name === userData.username) {
          errors.push('Username has been registered');
        }
        if(user.email === userData.email) {
          errors.push('Email has been registered');
        }
      }
    }
    if(userData.password !== userData.confirmPassword) {
      errors.push('Password and confirm password do not match');
    }
    if(errors.length > 0) {
      return res.status(400).json({ error: errors });
    }
    try {
      const registerData = await authService.registerService(userData);
      await authService.requestOTP(userData.email);
      return res.status(200).json({ message: 'Registration successful, please verify your email'});
    } catch (error) {
      return res.status(400).json({ error: [error.message] });
    }
  },
  async verifyOTP(req, res) {
    const { inputOTP, email } = req.body;
    if (!email || !inputOTP) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }
    try {
      const result = await authService.verifyOTP(email, inputOTP);
      const user = await db.User.findOne({ where: { email } });
      await user.update({ isAuthenticated: true });
      await user.save();
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error during OTP verification:', error.message);
      return res.status(400).json({ error: error.message });
    }
  },
  async requestOTP(req, res) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    try {
      await authService.requestOTP(email);
      return res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  async resetPassword(req, res) {
    const { email, newPassword, newConfirmedPassword } = req.body;
    if (!email || !newPassword || !newConfirmedPassword) {
      console.log('Email:', email);
      console.log('New Password:', newPassword);
      console.log('Confirmed Password:', newConfirmedPassword);
      return res.status(400).json({ error: 'Email and new password are required' });
    }
    if (newPassword !== newConfirmedPassword) {
      console.log('New Password:', newPassword);
      console.log('Confirmed Password:', newConfirmedPassword);
      return res.status(400).json({ error: 'New password and confirmation do not match' });
    }
    try {
      await authService.resetPassword(email, newPassword);
      return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  // async logout(req, res) {
  //   const user = req.user;
  //   if(!user) {
  //     return res.status(401).json({ error: 'Unauthorized' });
  //   }
  //   try {
  //     await authService.logoutService(user.userid);
  //     return res.status(200).json({ message: 'Logout successful' });
  //   } catch (error) {
  //     return res.status(500).json({ error: error.message });
  //   }
  // },
  async getSessionInfo(req, res) {
    const user = req.user;
    if(!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const outputData = {
      userid: user.userid,
      name: user.name,
      email: user.email,
      exp: user.exp,
      rankPoint: user.rankPoint,
      bio: user.bio,
      isTwoFactored: user.isTwoFactored,
      profilePicture: user.profilePicture,
      userPreference: user.userPreferences || ''
    }
    console.log('Session info:', outputData);
    return res.status(200).json({ message: 'Session info retrieved successfully', data: outputData });
  },
  async refreshToken(req, res) {
    try {
      console.log("START REFRESH TOKEN");
    //       console.log("Cookie: ", req.headers.cookie);
    // const cookieJson = JSON.parse(req.headers.cookie);
    // console.log("Cookie JSON: ", cookieJson);
    // const token = cookieJson ? cookieJson.accessToken : null;
      console.log("COOKIES:", req.headers.cookie);
      const cookieJson = JSON.parse(req.headers.cookie || '{}');
      console.log("COOKIE JSON:", cookieJson);
      const refreshToken = cookieJson?.refreshToken;
      console.log("REFRESH TOKEN:", refreshToken);
      if (!refreshToken) {
        console.log("NO REFRESH TOKEN");
        return res.status(401).json({ error: 'No refresh token provided' });
      }
      const data = await authService.refreshTokenService(refreshToken);
      console.log("REFRESH TOKEN DATA:", data);
      return res.status(200).json({ message: 'Refresh Successfully', data: data.token });

    } catch (error) {
      console.error('Error during token refresh:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }
};
export default authController;