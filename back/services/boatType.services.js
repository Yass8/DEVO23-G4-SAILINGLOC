import db from "../models/index.js";
const { BoatType } = db;

const getAllBoatTypes = async () => {
    return await BoatType.findAll();
};

const createBoatType = async (data) => {
    return await BoatType.create(data);
};

const getBoatTypeById = async (id) => {
    return await BoatType.findByPk(id);
};

const updateBoatType = async (id, data) => {
    const type = await BoatType.findByPk(id);
    if (!type) return null;
    return await type.update(data);
};

const deleteBoatType = async (id) => {
    const type = await BoatType.findByPk(id);
    if (!type) return null;
    await type.destroy();
    return true;
};

export default {
    getAllBoatTypes,
    createBoatType,
    getBoatTypeById,
    updateBoatType,
    deleteBoatType
};