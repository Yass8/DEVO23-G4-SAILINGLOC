import db from "../models/index.js";
const { User_document: UserDocument, User } = db;

const getAllUserDocuments = async () => {
    return await UserDocument.findAll({
        include: User
    });
};

const createUserDocument = async (data) => {
    return await UserDocument.create(data);
};

const getUserDocumentById = async (id) => {
    return await UserDocument.findByPk(id, {
        include: User
    });
};

const updateUserDocument = async (id, data) => {
    const document = await UserDocument.findByPk(id);
    if (!document) return null;
    return await document.update(data);
};

const deleteUserDocument = async (id) => {
    const document = await UserDocument.findByPk(id);
    if (!document) return null;
    await document.destroy();
    return true;
};

const getUserDocuments = async (userId) => {
    return await UserDocument.findAll({
        where: { user_id: userId }
    });
};

export default {
    getAllUserDocuments,
    createUserDocument,
    getUserDocumentById,
    updateUserDocument,
    deleteUserDocument,
    getUserDocuments
};