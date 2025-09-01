import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import { sanitizeUser } from "../utils/sanitize.js";
import {
  sendConfirmationEmail,
  sendResetPasswordEmail
} from "../utils/mailer.js";

dotenv.config();

const { User } = db;
const JWT_SECRET = process.env.SECRET_KEY;
const JWT_EXPIRATION = process.env.EXPIRATION_TIME;

const generateToken = (payload, expiresIn = JWT_EXPIRATION) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn });

const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !user.checkPassword(password)) {
    throw new Error("Email ou mot de passe incorrect.");
  }

  const token = generateToken({ id: user.id, roles: user.roles });
  return { user: sanitizeUser(user), token };
};

const registerUser = async (data) => {
  const userData = {
    ...data,
    roles: data.isOwner ? ["owner"] : data.roles
  };

  const user = await User.create(userData);
  const token = generateToken({ id: user.id });

  await sendConfirmationEmail(user.firstname, user.email, token);
  return sanitizeUser(user);
};

const confirmEmail = async (token) => {
  try {
    const { id } = verifyToken(token);
    const user = await User.findByPk(id);
    if (!user) throw new Error("Utilisateur non trouvé.");

    // user.is_email_confirmed = true;
    await user.save();
    return sanitizeUser(user);
  } catch {
    throw new Error("Token invalide ou expiré.");
  }
};

const forgotPasswordEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Utilisateur non trouvé.");

  const resetToken = generateToken({ id: user.id }, "1h");
  await sendResetPasswordEmail(user.firstname, user.email, resetToken);

  return { message: "Email de réinitialisation envoyé." };
};

const getCurrentUser = async (token) => {
  try {
    const { id } = verifyToken(token);
    const user = await User.findByPk(id);
    if (!user) throw new Error("Utilisateur non trouvé.");

    return sanitizeUser(user);
  } catch {
    throw new Error("Token invalide ou expiré.");
  }
};

const changePassword = async ({ email, oldPassword, newPassword }) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !user.checkPassword(oldPassword)) {
    throw new Error("Email ou mot de passe incorrect.");
  }

  user.password = newPassword;
  await user.save();
  return { message: "Mot de passe modifié avec succès." };
};

const resetPassword = async (token, newPassword) => {
  try {
    const { id } = verifyToken(token);
    const user = await User.findByPk(id);
    if (!user) throw new Error("Utilisateur non trouvé.");

    user.password = newPassword;
    await user.save();
    return { message: "Mot de passe réinitialisé avec succès." };
  } catch {
    throw new Error("Token invalide ou expiré.");
  }
};

export default {
  loginUser,
  registerUser,
  confirmEmail,
  forgotPasswordEmail,
  getCurrentUser,
  changePassword,
  resetPassword
};
