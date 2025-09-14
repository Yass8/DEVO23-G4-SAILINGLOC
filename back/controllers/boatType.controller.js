import boatTypeService from '../services/boatType.services.js';

const index = async (req, res) => {
  try {
    const types = await boatTypeService.getAllBoatTypes();
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const data = req.body;
    
    // Récupérer le fichier photo s'il est fourni
    const file = req.files?.photo ? req.files.photo : null;
    
    console.log('Données reçues:', data);
    console.log('Fichier reçu:', file ? { name: file.name, size: file.size, mimetype: file.mimetype } : 'Aucun fichier');

    const result = await boatTypeService.createBoatType(data, file);
    res.status(201).json(result);
  } catch (error) {
    console.error('Erreur dans le contrôleur:', error);
    res.status(500).json({ error: error.message });
  }
};

const show = async (req, res) => {
  try {
    const result = await boatTypeService.getBoatTypeById(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Type de bateau non trouvé" });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Récupérer le fichier photo s'il est fourni
    const file = req.files?.photo ? req.files.photo : null;

    const result = await boatTypeService.updateBoatType(
      Number(id),
      data,
      file
    );

    if (!result) {
      return res.status(404).json({ error: "Type de bateau non trouvé" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await boatTypeService.deleteBoatType(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Type de bateau non trouvé" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { index, create, show, update, remove };