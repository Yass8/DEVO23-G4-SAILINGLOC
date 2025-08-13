import boatEquipmentService from '../services/boatEquipment.services.js';

const index = async (req, res) => {
  try {
    const equipments = await boatEquipmentService.getAllBoatEquipments();
    res.json(equipments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const result = await boatEquipmentService.createBoatEquipment(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const show = async (req, res) => {
  try {
    const result = await boatEquipmentService.getBoatEquipmentById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const result = await boatEquipmentService.updateBoatEquipment(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await boatEquipmentService.deleteBoatEquipment(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBoatEquipments = async (req, res) => {
  try {
    const result = await boatEquipmentService.getBoatEquipments(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  index, create, show, update, remove,
  getBoatEquipments
};