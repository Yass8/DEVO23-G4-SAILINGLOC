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
    const { user_id, type } = req.body;

    const files = Array.isArray(req.files?.documents)
      ? req.files.documents
      : [req.files.documents];

    const result = await userDocumentService.createUserDocument(
      Number(user_id),
      type,
      files
    );
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
    const { id } = req.params;
    const data = req.body;
    
    // Récupérer le fichier s'il est fourni
    const file = req.files?.document ? req.files.document : null;

    const result = await userDocumentService.updateUserDocument(
      Number(id),
      data,
      file
    );
    
    if (!result) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }
    
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

// Nouvelle fonction pour approuver un document
const approveDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    
    const result = await userDocumentService.approveUserDocument(
      Number(id),
      true,
      message
    );
    
    if (!result) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Nouvelle fonction pour rejeter un document
const rejectDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    
    const result = await userDocumentService.rejectUserDocument(
      Number(id),
      message
    );
    
    if (!result) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Nouvelle fonction pour récupérer les documents par type
const getDocumentsByType = async (req, res) => {
  try {
    const { user_id, type } = req.params;
    
    const result = await userDocumentService.getUserDocumentsByType(
      Number(user_id),
      type
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Nouvelle fonction pour récupérer les documents en attente
const getPendingDocuments = async (req, res) => {
  try {
    const result = await userDocumentService.getPendingUserDocuments();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { 
  index, 
  create, 
  show, 
  update, 
  remove, 
  getUserDocuments,
  approveDocument,
  rejectDocument,
  getDocumentsByType,
  getPendingDocuments
};