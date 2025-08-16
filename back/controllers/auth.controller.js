import authService from '../services/auth.services.js';


const register = async (req, res) => {
  try {
    const auth = await authService.registerUser(req.body);
    res.status(201).json(auth);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const auth = await authService.loginUser(req.body);
    res.status(201).json(auth);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const currentUser = await authService.getCurrentUser(req.headers.authorization);
    res.status(200).json(currentUser);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const logout = (req, res) => {
  authService.logout(req, res);
}

const changePassword = async (req, res) => {
  try {
    const response = await authService.changePassword(req.body);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const forgotPasswordEmail = async (req, res) => {
  try {
    const response = await authService.forgotPasswordEmail(req.body.email);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const response = await authService.resetPassword(token, password);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const confirmEmail = async (req, res) => {
  const token = req.params.token;
  try {
    const user = await authService.confirmEmail(token);
    res.status(200).json({ message: 'Email confirmé avec succès.', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export default {
  register,
  login,
  getCurrentUser,
  logout,
  confirmEmail,
  changePassword,
  resetPassword,
  forgotPasswordEmail
};
