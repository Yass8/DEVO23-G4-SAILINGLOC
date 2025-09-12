import db from "../models/index.js";
import { Op } from "sequelize";
import uploadFile from "../utils/uploadFile.js";
import fs from "fs";
import path from "path";

const { BoatPhoto, Boat } = db;

const getAllBoatPhotos = async () => {
  return await BoatPhoto.findAll({
    include: Boat,
  });
};

const createBoatPhotos = async (boatId, files, mainIndex = 0) => {
  if (!files?.length) throw new Error("Aucune photo fournie");

  if (mainIndex < 0 || mainIndex >= files.length) {
    throw new Error(
      `mainIndex (${mainIndex}) invalide : doit être entre 0 et ${
        files.length - 1
      }`
    );
  }

  const t = await db.sequelize.transaction();

  try {
    const photos = await Promise.all(
      files.map(async (file, idx) => {
        const filePath = await uploadFile.saveFile(
          "boat",
          file.data,
          file.name,
          `boats/${boatId}/photos`,
          [".jpg", ".jpeg", ".png", ".gif"],
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
    include: Boat,
  });
};

const updateBoatPhoto = async (id, data, file) => {
  const t = await db.sequelize.transaction();

  try {
    const photo = await BoatPhoto.findByPk(id, { transaction: t });
    if (!photo) {
      await t.rollback();
      return null;
    }

    // Si un nouveau fichier est fourni
    if (file) {
      // Supprimer l'ancien fichier
      if (photo.photo_url) {
        const oldFilePath = path.join(
          process.cwd(),
          "uploads",
          photo.photo_url
        );
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Uploader le nouveau fichier
      const filePath = await uploadFile.saveFile(
        "boat",
        file.data,
        file.name,
        `boats/${photo.boat_id}/photos`,
        [".jpg", ".jpeg", ".png", ".gif"],
        2
      );

      data.photo_url = filePath;
    }

    // Mettre à jour la photo dans la base de données
    const updatedPhoto = await photo.update(data, { transaction: t });

    // Si on définit cette photo comme principale, désactiver les autres is_main
    if (data.is_main === true) {
      await BoatPhoto.update(
        { is_main: false },
        {
          where: {
            boat_id: photo.boat_id,
            id: { [db.Sequelize.Op.ne]: id },
          },
          transaction: t,
        }
      );
    }

    await t.commit();
    return updatedPhoto;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const deleteBoatPhoto = async (id) => {
  const t = await db.sequelize.transaction();

  try {
    const photo = await BoatPhoto.findByPk(id, { transaction: t });
    if (!photo) {
      await t.rollback();
      return null;
    }

    // Supprimer le fichier physique
    if (photo.photo_url) {
      const filePath = path.join(process.cwd(), "uploads", photo.photo_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Supprimer l'enregistrement de la base de données
    await photo.destroy({ transaction: t });

    await t.commit();
    return true;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const getBoatPhotos = async (boatId) => {
  return await BoatPhoto.findAll({
    where: { boat_id: boatId },
  });
};

const syncBoatPhotos = async (boatId, keptIds, newFiles, mainId) => {
  const t = await db.sequelize.transaction();

  try {
    // Supprimer les photos non gardées
    const toDelete = await db.BoatPhoto.findAll({
      where: { boat_id: boatId, id: { [Op.notIn]: keptIds } },
      transaction: t,
    });

    for (const ph of toDelete) {
      const fullPath = path.join(process.cwd(), "uploads", ph.photo_url);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      await ph.destroy({ transaction: t });
    }

    // Désactiver is_main sur toutes les photos du bateau
    await db.BoatPhoto.update(
      { is_main: false },
      { where: { boat_id: boatId }, transaction: t }
    );

    // Ajouter les nouvelles photos
    if (newFiles?.length) {
      await Promise.all(
        newFiles.map(async (file, idx) => {
          const filePath = await uploadFile.saveFile(
            "boat",
            file.data,
            file.name,
            `boats/${boatId}/photos`,
            [".jpg", ".jpeg", ".png", ".gif"],
            2
          );

          await db.BoatPhoto.create(
            {
              boat_id: boatId,
              photo_url: filePath,
              is_main: false,
            },
            { transaction: t }
          );
        })
      );
    }

    // Définir la photo principale
    if (mainId) {
      await db.BoatPhoto.update(
        { is_main: true },
        { where: { id: mainId, boat_id: boatId }, transaction: t }
      );
    }

    await t.commit();
    return true;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

export default {
  getAllBoatPhotos,
  createBoatPhotos,
  getBoatPhotoById,
  updateBoatPhoto,
  deleteBoatPhoto,
  getBoatPhotos,
  syncBoatPhotos
};