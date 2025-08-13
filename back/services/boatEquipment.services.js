import db from "../models/index.js";
const { BoatEquipment, Boat } = db;

const getAllBoatEquipments = async () => {
    return await BoatEquipment.findAll({
        include: Boat
    });
};

const createBoatEquipment = async (data) => {
    return await BoatEquipment.create(data);
};

const getBoatEquipmentById = async (id) => {
    return await BoatEquipment.findByPk(id, {
        include: Boat
    });
};

const updateBoatEquipment = async (id, data) => {
    const equipment = await BoatEquipment.findByPk(id);
    if (!equipment) return null;
    return await equipment.update(data);
};

const deleteBoatEquipment = async (id) => {
    const equipment = await BoatEquipment.findByPk(id);
    if (!equipment) return null;
    await equipment.destroy();
    return true;
};

const getBoatEquipments = async (boatId) => {
    return await BoatEquipment.findAll({
        where: { boat_id: boatId }
    });
};

export default {
    getAllBoatEquipments,
    createBoatEquipment,
    getBoatEquipmentById,
    updateBoatEquipment,
    deleteBoatEquipment,
    getBoatEquipments
};