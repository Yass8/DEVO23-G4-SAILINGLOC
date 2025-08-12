import db from "../models/index.js";
const { BoatPhoto, Boat } = db;
import uploadFile from "../utils/uploadFile.js";


const getAllBoatPhotos = async () => {
    return await BoatPhoto.findAll({
        include: Boat
    });
};

const createBoatPhotos = async (boatId, files, mainIndex = 0) => {
  
  if (!files?.length) throw new Error('Aucune photo fournie');

  if (mainIndex < 0 || mainIndex >= files.length) {
    throw new Error(
      `mainIndex (${mainIndex}) invalide : doit être entre 0 et ${files.length - 1}`
    );
  }

  const t = await db.sequelize.transaction();

  try {
    const photos = await Promise.all(
      files.map(async (file, idx) => {
        const filePath = await uploadFile.saveFile(
          'boat',
          file.data,
          file.name,
          `boats/${boatId}/photos`,
          ['.jpg', '.jpeg', '.png', '.gif'],
          2
        );

        return BoatPhoto.create(
          {
            boat_id: boatId,
            photo_url: filePath,
            is_main: idx === mainIndex,
          },
          { transaction: t }
        );
      })
    );

    await t.commit();
    return photos;
  } catch (err) {
    await t.rollback();
    throw err;
  }
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
    createBoatPhotos,
    getBoatPhotoById,
    updateBoatPhoto,
    deleteBoatPhoto,
    getBoatPhotos
};