import db from "../models/index.js";
const { Port, Boat } = db;

const getAllPorts = async () => {
    return await Port.findAll({
        include: Boat
    });
};

const createPort = async (data) => {
    return await Port.create(data);
};

const getPortById = async (id) => {
    return await Port.findByPk(id, {
        include: Boat
    });
};

const updatePort = async (id, data) => {
    const port = await Port.findByPk(id);
    if (!port) return null;
    return await port.update(data);
};

const deletePort = async (id) => {
    const port = await Port.findByPk(id);
    if (!port) return null;
    await port.destroy();
    return true;
};

export default {
    getAllPorts,
    createPort,
    getPortById,
    updatePort,
    deletePort
};