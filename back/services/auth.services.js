import db from "../models/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sanitizeUser } from "../utils/sanitize.js";

dotenv.config();

const JWT_SECRET  = process.env.SECRET_KEY;
const JWT_EXPIRATION = process.env.EXPIRATION_TIME;


const { User } = db;

const loginUser = async (data) => {
    const user = await User.findOne({ where: { email: data.email } });
    if (!user || !user.checkPassword(data.password)) {
        throw new Error('Email ou mot de passe incorrect.');
    }
    const token = jwt.sign({ id: user.id, roles: user.roles }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
   
    return {user: sanitizeUser(user), token };
};

const registerUser = async (data) => {
    if(data.isOwner ){
        data.roles = ['owner'];
    }
    const user = await User.create(data);
    return user;
};


const getCurrentUser = async (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            throw new Error('Utilisateur non trouvé.');
        }
        return sanitizeUser(user);
    } catch (err) {
        throw new Error('Token invalide ou expiré.');
    }
};

const logout = (req, res) => {
    res.status(200).json({ message: 'Déconnexion réussie.' });
}

const changePassword = async (data) => {
    const user = await User.findOne({ where: { email: data.email } });
    if (!user || !user.checkPassword(data.oldPassword)) {
        throw new Error('Email ou mot de passe incorrect.');
    }
    user.password = data.newPassword;
    await user.save();
    return { message: 'Mot de passe modifié avec succès.' };
}
const forgotPassword = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Email non trouvé.');
    }
    // Logique pour envoyer un email de réinitialisation de mot de passe
    // Par exemple, générer un token de réinitialisation et l'envoyer par email
    // Pour l'instant, on simule l'envoi d'un email
    console.log(`Email de réinitialisation envoyé à ${email}`);
    // Vous pouvez utiliser un service d'envoi d'email comme Nodemailer ou SendGrid ici
    // Exemple :    
    // await sendResetPasswordEmail(user.email, resetToken);
    // return { message: 'Email de réinitialisation envoyé.' };

    return { message: 'Email de réinitialisation envoyé.' };
}

export default {
    loginUser,
    registerUser,
    getCurrentUser,
    logout,
    changePassword,
    forgotPassword
};
