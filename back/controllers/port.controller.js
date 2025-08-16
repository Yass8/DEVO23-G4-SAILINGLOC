import portService from '../services/port.services.js';

const index = async (req, res) => {
  try {
    const ports = await portService.getAllPorts();
    res.json(ports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const result = await portService.createPort(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const show = async (req, res) => {
  try {
    const result = await portService.getPortById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const result = await portService.updatePort(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await portService.deletePort(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { index, create, show, update, remove };