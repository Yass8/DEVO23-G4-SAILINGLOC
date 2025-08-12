import db from "../models/index.js";
const { Payment, Reservation } = db;

const getAllPayments = async () => {
    return await Payment.findAll({
        include: Reservation
    });
};

const createPayment = async (data) => {
    return await Payment.create(data);
};

const getPaymentById = async (id) => {
    return await Payment.findByPk(id, {
        include: Reservation
    });
};

const updatePayment = async (id, data) => {
    const payment = await Payment.findByPk(id);
    if (!payment) return null;
    return await payment.update(data);
};

const deletePayment = async (id) => {
    const payment = await Payment.findByPk(id);
    if (!payment) return null;
    await payment.destroy();
    return true;
};

const getReservationPayments = async (reservationId) => {
    return await Payment.findAll({
        where: { reservation_id: reservationId },
        include: Reservation
    });
};

export default {
    getAllPayments,
    createPayment,
    getPaymentById,
    updatePayment,
    deletePayment,
    getReservationPayments
};