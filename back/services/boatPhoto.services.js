import db from "../models/index.js";
const { BoatPhoto, Boat } = db;

const getAllBoatPhotos = async () => {
    return await BoatPhoto.findAll({
        include: Boat
    });
};

const createBoatPhoto = async (data) => {
    return await BoatPhoto.create(data);
};

const getBoatPhotoById = async (id) => {
    return await BoatPhoto.findByPk(id, {
        include: Boat
    });
};

const updateBoatPhoto = async (id, data) => {
    const photo = await BoatPhoto.findByPk(id);
    if (!photo) return null;
    return await photo.update(data);
};

const deleteBoatPhoto = async (id) => {
    const photo = await BoatPhoto.findByPk(id);
    if (!photo) return null;
    await photo.destroy();
    return true;
};

const getBoatPhotos = async (boatId) => {
    return await BoatPhoto.findAll({
        where: { boat_id: boatId }
    });
};

export default {
    getAllBoatPhotos,
    createBoatPhoto,
    getBoatPhotoById,
    updateBoatPhoto,
    deleteBoatPhoto,
    getBoatPhotos
};