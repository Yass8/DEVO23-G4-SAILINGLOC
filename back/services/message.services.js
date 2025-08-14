import db from "../models/index.js";
const { Message, User, Reservation } = db;

const getAllMessages = async () => {
    return await Message.findAll({
        include: [
            { model: User, as: 'Sender' },
            { model: User, as: 'Receiver' },
            { model: Reservation }
        ]
    });
};

const createMessage = async (data) => {
    return await Message.create(data);
};

const getMessageById = async (id) => {
    return await Message.findByPk(id, {
        include: [User, Reservation]
    });
};

const updateMessage = async (id, data) => {
    const message = await Message.findByPk(id);
    if (!message) return null;
    return await message.update(data);
};

const deleteMessage = async (id) => {
    const message = await Message.findByPk(id);
    if (!message) return null;
    await message.destroy();
    return true;
};

const getUserMessages = async (userId) => {
    return await Message.findAll({
        where: { sender_id: userId },
        include: [User, Reservation]
    });
};

const getReservationMessages = async (reservationId) => {
    return await Message.findAll({
        where: { reservation_id: reservationId },
        include: User
    });
};

export default {
    getAllMessages,
    createMessage,
    getMessageById,
    updateMessage,
    deleteMessage,
    getUserMessages,
    getReservationMessages
};