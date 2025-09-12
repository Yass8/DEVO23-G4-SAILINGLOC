import boatService from '../services/boat.services.js';
import { validationResult } from 'express-validator';
import { validateCreateBoat } from '../validators/boat.validator.js';

const index = async (req, res) => {
  try {
    const boats = await boatService.getAllBoats();
    res.json(boats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    //  Parser le JSON depuis req.body.data
    let data = {};
    if (req.body.data) {
      try {
        data = JSON.parse(req.body.data);
      } catch (e) {
        return res.status(400).json({ error: "JSON invalide dans 'data'" });
      }
    } else {
      return res.status(400).json({ error: "Le champ 'data' est manquant" });
    }

    //  Injecter les champs parsés dans req.body pour la validation
    req.body = data;

    //  Valider manuellement
    await Promise.all(validateCreateBoat.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //  Récupérer les fichiers
    const insuranceFile = req.files?.insurance_url;
    const registrationFile = req.files?.registration_url;

    if (!insuranceFile || !registrationFile) {
      return res.status(400).json({ error: "Les fichiers insurance et registration sont requis." });
    }

    //  Appeler le service
    const result = await boatService.createBoat(req.body, {
      insurance_url: insuranceFile,
      registration_url: registrationFile,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const show = async (req, res) => {
  try {
    const result = await boatService.getBoatById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const showBySlug = async (req, res) => {
  try {
    console.log('[showBySlug] req.params.slug :', req.params.slug);
    const boat = await boatService.getBoatBySlug(req.params.slug);
    if (!boat) return res.status(404).json({ error: "Bateau introuvable" });
    res.json(boat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const result = await boatService.updateBoat(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await boatService.deleteBoat(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFilteredBoats = async (req, res) => {
  try {
    const filters = req.query;
    
    const result = await boatService.getFilteredBoats(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getBoatPhotos = async (req, res) => {
  try {
    const result = await boatService.getBoatPhotos(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBoatEquipments = async (req, res) => {
  try {
    const result = await boatService.getBoatEquipments(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBoatAvailabilities = async (req, res) => {
  try {
    const result = await boatService.getBoatAvailabilities(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBoatReviews = async (req, res) => {
  try {
    const result = await boatService.getBoatReviews(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBoatReservations = async (req, res) => {
  try {
    const result = await boatService.getBoatReservations(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  index, create, show, update, remove,
  getBoatPhotos, getBoatEquipments, getBoatAvailabilities,
  getBoatReviews, getBoatReservations, showBySlug, getFilteredBoats
};