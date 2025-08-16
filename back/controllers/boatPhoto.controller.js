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
    const { boat_id, mainIndex } = req.body;

    const files = Array.isArray(req.files?.photos)
      ? req.files.photos
      : [req.files.photos];

    const result = await boatPhotoService.createBoatPhotos(
      Number(boat_id),
      files,
      Number(mainIndex)
    );
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