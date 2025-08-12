import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.SECRET_KEY;

/**
 * * Vérification si l'utilisateur est authentifié
    * @param {Object} req - Requête HTTP
    * @param {Object} res - Réponse HTTP
    * @param {Function} next - Fonction middleware suivante
    * @return {void}
 */
export const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Token manquant ou invalide." });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token invalide ou expiré." });
    }
};

/** * * Autorisation des utilisateurs en fonction de leurs rôles
 * @param {Array} roles - Rôles autorisés
 * @return {Function} Middleware d'autorisation
 * */
export const authorizeUser = (roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.roles) {
            return res.status(403).json({ message: "Accès refusé. Rôle non autorisé." });
        }
        const hasRole = roles.some(role => req.user.roles.includes(role));
        if (!hasRole) {
            return res.status(403).json({ message: "Accès refusé. Rôle non autorisé." });
        }
        next();
    };
}