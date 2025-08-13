import db from "../models/index.js";
const { Availability, Boat } = db;

const getAllAvailabilities = async () => {
    return await Availability.findAll();
};

const createAvailability = async (data) => {
    return await Availability.create(data);
};

const getAvailabilityById = async (id) => {
    return await Availability.findByPk(id);
};

const updateAvailability = async (id, data) => {
    const availability = await Availability.findByPk(id);
    if (!availability) return null;
    return await availability.update(data);
};

const deleteAvailability = async (id) => {
    const availability = await Availability.findByPk(id);
    if (!availability) return null;
    await availability.destroy();
    return true;
};

const getBoatAvailabilities = async (boatId) => {
    return await Availability.findAll({
        where: { boat_id: boatId },
        include: Boat
    });
};

export default {
    getAllAvailabilities,
    createAvailability,
    getAvailabilityById,
    updateAvailability,
    deleteAvailability,
    getBoatAvailabilities
};