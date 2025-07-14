import db from "../models/index.js";
const { Contract, Reservation } = db;

const getAllContracts = async () => {
    return await Contract.findAll({
        include: Reservation
    });
};

const createContract = async (data) => {
    return await Contract.create(data);
};

const getContractById = async (id) => {
    return await Contract.findByPk(id, {
        include: Reservation
    });
};

const updateContract = async (id, data) => {
    const contract = await Contract.findByPk(id);
    if (!contract) return null;
    return await contract.update(data);
};

const deleteContract = async (id) => {
    const contract = await Contract.findByPk(id);
    if (!contract) return null;
    await contract.destroy();
    return true;
};

const getReservationContract = async (reservationId) => {
    return await Contract.findOne({
        where: { reservation_id: reservationId },
        include: Reservation
    });
};

export default {
    getAllContracts,
    createContract,
    getContractById,
    updateContract,
    deleteContract,
    getReservationContract
};