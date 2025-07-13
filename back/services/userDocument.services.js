import db from '../models/index.js';
const { User_document } = db;

const getAllUserDocuments = async () => {
  return await User_document.findAll();
};

const createUserDocument = async (data) => {
  return await User_document.create(data);
};

const getUserDocumentById = async (id) => {
  return await User_document.findByPk(id);
};

const updateUserDocument = async (id, data) => {
  const userDocument = await User_document.findByPk(id);
  if (!userDocument) return null;
  await User_document.update(data);
  return userDocument;
};

const deleteUserDocument = async (id) => {
  const userDocument = await User_document.findByPk(id);
  if (!userDocument) return null;
  await User_document.destroy();
  return userDocument;
};

const getUserDocuments = async (userId) => {
  return await User_document.findAll({ where: { userId } });
};

export default {
  getAllUserDocuments,
  createUserDocument,
  getUserDocumentById,
  updateUserDocument,
  deleteUserDocument,
  getUserDocuments
};
