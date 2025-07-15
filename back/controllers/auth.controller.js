import authService from '../services/auth.services.js';


const register = async (req, res) => {
  try {
    const auth = await authService.registerUser(req.body);
    res.status(201).json(auth);
  } catch (err) {
    res.status(400).json({ message: err.message });
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

export default {
  register,
  login
};
