import userDocumentService from '../services/userDocument.services.js';

const index = async (req, res) => {
  try {
    const documents = await userDocumentService.getAllUserDocuments();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const result = await userDocumentService.createUserDocument(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const show = async (req, res) => {
  try {
    const result = await userDocumentService.getUserDocumentById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const result = await userDocumentService.updateUserDocument(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await userDocumentService.deleteUserDocument(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserDocuments = async (req, res) => {
  try {
    const result = await userDocumentService.getUserDocuments(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { index, create, show, update, remove, getUserDocuments };