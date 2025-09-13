import db from "../models/index.js";
import uploadFile from "../utils/uploadFile.js";
import fs from "fs";
import path from "path";

const { BoatType } = db;

const getAllBoatTypes = async () => {
    return await BoatType.findAll();
};

const createBoatType = async (data, file) => {
    const t = await db.sequelize.transaction();

    try {
        // Si un fichier photo est fourni, l'uploader d'abord
        if (file) {
            console.log('Fichier reçu:', file.name, file.size, file.mimetype);
            const filePath = await uploadFile.saveFile(
                "boattype",
                file.data,
                file.name,
                "boatTypes/photos",
                [".jpg", ".jpeg", ".png", ".gif"],
                5
            );
            data.photo_url = filePath;
            console.log('Fichier uploadé vers:', filePath);
        }

        const boatType = await BoatType.create(data, { transaction: t });
        
        await t.commit();
        return boatType;
    } catch (err) {
        await t.rollback();
        console.error('Erreur lors de la création:', err);
        throw err;
    }
};

const getBoatTypeById = async (id) => {
    return await BoatType.findByPk(id);
};

const updateBoatType = async (id, data, file) => {
    const t = await db.sequelize.transaction();

    try {
        const boatType = await BoatType.findByPk(id, { transaction: t });
        if (!boatType) {
            await t.rollback();
            return null;
        }

        // Si un nouveau fichier est fourni
        if (file) {
            // Supprimer l'ancien fichier s'il existe
            if (boatType.photo_url) {
                const oldFilePath = path.join(
                    process.cwd(),
                    "uploads",
                    boatType.photo_url
                );
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }

            // Uploader le nouveau fichier
            const filePath = await uploadFile.saveFile(
                "boattype",
                file.data,
                file.name,
                "boatTypes/photos",
                [".jpg", ".jpeg", ".png", ".gif"],
                2
            );

            data.photo_url = filePath;
        }

        // Mettre à jour le type de bateau dans la base de données
        const updatedBoatType = await boatType.update(data, { transaction: t });

        await t.commit();
        return updatedBoatType;
    } catch (err) {
        await t.rollback();
        throw err;
    }
};

const deleteBoatType = async (id) => {
    const t = await db.sequelize.transaction();

    try {
        const boatType = await BoatType.findByPk(id, { transaction: t });
        if (!boatType) {
            await t.rollback();
            return null;
        }

        // Supprimer le fichier physique s'il existe
        if (boatType.photo_url) {
            const filePath = path.join(process.cwd(), "uploads", boatType.photo_url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Supprimer l'enregistrement de la base de données
        await boatType.destroy({ transaction: t });

        await t.commit();
        return true;
    } catch (err) {
        await t.rollback();
        throw err;
    }
};

export default {
    getAllBoatTypes,
    createBoatType,
    getBoatTypeById,
    updateBoatType,
    deleteBoatType
};