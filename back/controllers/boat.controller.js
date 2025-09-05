import boatService from '../services/boat.services.js';

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
    const result = await boatService.createBoat(req.body);
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
    console.log(filters);
    
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