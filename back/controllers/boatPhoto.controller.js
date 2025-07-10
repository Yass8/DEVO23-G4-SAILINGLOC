import boatPhotoService from '../services/boatPhoto.services.js';

const index = async (req, res) => {
  try {
    const photos = await boatPhotoService.getAllBoatPhotos();
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const result = await boatPhotoService.createBoatPhoto(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const show = async (req, res) => {
  try {
    const result = await boatPhotoService.getBoatPhotoById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const result = await boatPhotoService.updateBoatPhoto(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await boatPhotoService.deleteBoatPhoto(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBoatPhotos = async (req, res) => {
  try {
    const result = await boatPhotoService.getBoatPhotos(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  index, create, show, update, remove,
  getBoatPhotos
};