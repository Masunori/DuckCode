import authService from '../services/authService.js';
const authController = {
  async login(req, res) {
    const { email, password } = req.body;
    if(!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
      const loginData = await authService.logInService(email, password);
      res.cookie('accessToken', loginData.token.accessToken, {
      httpOnly: true,
      secure: false,               // true nếu dùng HTTPS
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000       // 1 giờ
    });
    res.cookie('refreshToken', loginData.token.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
    });
    return res.status(200).json({ message: 'Login successful', data: loginData });
    } catch (error) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // set loginData to session and cookie

  },
  async register(req, res) {
    const userData = req.body;
    if(!userData.email || !userData.password || !userData.confirmPassword || !userData.username) {
      return res.status(422).json({ error: 'Email, password and confirm password are required' });
    }
    let data;
    console.log('Registering user:', userData.username, userData.email);
    try {
      data = await authService.registerService(userData);
    } catch (error) {
      console.error('Registration error:', error.message);
      return res.status(500).json({ error: error.message });
    }
    await authService.requestOTP(userData.email);
    return res.status(201).json({ message: 'Registration successful, please check your email for OTP', data: userData });
  },
  async verifyOTP(req, res) {
    const { inputOTP, email } = req.body;
    if (!email || !inputOTP) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }
    try {
      const result = await authService.verifyOTP(email, inputOTP);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
export default authController;