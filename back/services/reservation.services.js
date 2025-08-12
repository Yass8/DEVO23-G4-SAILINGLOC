import db from "../models/index.js";
const { Reservation, User, Boat, Payment, Contract } = db;

const getAllReservations = async () => {
    return await Reservation.findAll({
        include: [User, Boat]
    });
};

const createReservation = async (data) => {
    return await Reservation.create(data);
};

const getReservationById = async (id) => {
    return await Reservation.findByPk(id, {
        include: [User, Boat, Payment, Contract]
    });
};

const updateReservation = async (id, data) => {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) return null;
    return await reservation.update(data);
};

const deleteReservation = async (id) => {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) return null;
    await reservation.destroy();
    return true;
};

const getUserBookings = async (userId) => {
    return await Reservation.findAll({
        where: { user_id: userId },
        include: Boat
    });
};

const getBoatReservations = async (boatId) => {
    return await Reservation.findAll({
        where: { boat_id: boatId },
        include: User
    });
};

export default {
    getAllReservations,
    createReservation,
    getReservationById,
    updateReservation,
    deleteReservation,
    getUserBookings,
    getBoatReservations
};