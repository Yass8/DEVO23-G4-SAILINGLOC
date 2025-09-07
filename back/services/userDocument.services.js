import db from "../models/index.js";
const { UserDocument, User } = db;
import uploadFile from "../utils/uploadFile.js";
import fs from "fs";
import path from "path";

const getAllUserDocuments = async () => {
    return await UserDocument.findAll({
        include: User
    });
};

const createUserDocument = async (userId, type, files) => {
    if (!files?.length) throw new Error('Aucun document fourni');

    const t = await db.sequelize.transaction();

    try {
        const documents = await Promise.all(
            files.map(async (file) => {
                const filePath = await uploadFile.saveFile(
                    'user_document',
                    file.data,
                    file.name,
                    `users/${userId}/documents`,
                    ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.txt'],
                    5 // Taille max en MB
                );

                return UserDocument.create(
                    {
                        user_id: userId,
                        type: type,
                        file_url: filePath,
                        is_approved: false,
                        message: null
                    },
                    { transaction: t }
                );
            })
        );

        await t.commit();
        return documents;
    } catch (err) {
        await t.rollback();
        throw err;
    }
};

const getUserDocumentById = async (id) => {
    return await UserDocument.findByPk(id, {
        include: User
    });
};

const updateUserDocument = async (id, data, file) => {
    const t = await db.sequelize.transaction();
    
    try {
        const document = await UserDocument.findByPk(id, { transaction: t });
        if (!document) {
            await t.rollback();
            return null;
        }

        // Si un nouveau fichier est fourni
        if (file) {
            // Supprimer l'ancien fichier
            if (document.file_url) {
                const oldFilePath = path.join(process.cwd(), 'uploads', document.file_url);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }

            // Uploader le nouveau fichier
            const filePath = await uploadFile.saveFile(
                'user_document',
                file.data,
                file.name,
                `users/${document.user_id}/documents`,
                ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.txt'],
                5
            );

            data.file_url = filePath;
        }

        // Mettre à jour le document dans la base de données
        const updatedDocument = await document.update(data, { transaction: t });

        await t.commit();
        return updatedDocument;
    } catch (err) {
        await t.rollback();
        throw err;
    }
};

const approveUserDocument = async (id, isApproved, message = null) => {
    const document = await UserDocument.findByPk(id);
    if (!document) return null;
    
    return await document.update({
        is_approved: isApproved,
        message: message
    });
};

const rejectUserDocument = async (id, message) => {
    const document = await UserDocument.findByPk(id);
    if (!document) return null;
    
    return await document.update({
        is_approved: false,
        message: message
    });
};

const deleteUserDocument = async (id) => {
    const t = await db.sequelize.transaction();
    
    try {
        const document = await UserDocument.findByPk(id, { transaction: t });
        if (!document) {
            await t.rollback();
            return null;
        }

        // Supprimer le fichier physique
        if (document.file_url) {
            const filePath = path.join(process.cwd(), 'uploads', document.file_url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Supprimer l'enregistrement de la base de données
        await document.destroy({ transaction: t });

        await t.commit();
        return true;
    } catch (err) {
        await t.rollback();
        throw err;
    }
};

const getUserDocuments = async (user_id) => {
    return await UserDocument.findAll({
        where: { user_id: user_id }
    });
};

const getUserDocumentsByType = async (userId, type) => {
    return await UserDocument.findAll({
        where: { 
            user_id: userId,
            type: type
        }
    });
};

const getPendingUserDocuments = async () => {
    return await UserDocument.findAll({
        where: { 
            is_approved: false 
        },
        include: User
    });
};

export default {
    getAllUserDocuments,
    createUserDocument,
    getUserDocumentById,
    updateUserDocument,
    approveUserDocument,
    rejectUserDocument,
    deleteUserDocument,
    getUserDocuments,
    getUserDocumentsByType,
    getPendingUserDocuments
};