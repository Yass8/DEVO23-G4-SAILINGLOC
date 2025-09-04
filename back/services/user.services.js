import db from "../models/index.js";
const { User, Boat, Reservation, Message, Review, UserDocument } = db;
import uploadFile from "../utils/uploadFile.js";
import fs from "fs";
import path from "path";

const getAllUsers = async () => {
    return await User.findAll();
};

const createUser = async (data) => {
    return await User.create(data);
};

const showUser = async (id) => {
    return await User.findByPk(id);
};

const updateUser = async (id, data) => {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(data);
};

const removeUser = async (id) => {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return true;
};

const getUserBoats = async (userId) => {
    const user = await User.findByPk(userId, {
        include: Boat
    });
    return user ? user.Boats : null;
};

const getUserReservations = async (userId) => {
    const user = await User.findByPk(userId, {
        include: Reservation
    });
    return user ? user.Reservations : null;
};

const getUserMessages = async (userId) => {
    const user = await User.findByPk(userId, {
        include: Message
    });
    return user ? user.Messages : null;
};

const getUserReviews = async (userId) => {
    const user = await User.findByPk(userId, {
        include: Review
    });
    return user ? user.Reviews : null;
};

const getUserDocuments = async (userId) => {
    const user = await User.findByPk(userId, {
        include: UserDocument
    });
    return user ? user.UserDocuments : null;
};

const uploadUserPhoto = async (userId, file) => {

    const user = await User.findByPk(userId);
    if (!user) throw new Error("Utilisateur non trouvé");

    if (user.photo && !user.photo.startsWith("avatar")) {
        const oldFilePath = path.join(process.cwd(), user.photo);

        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
    }

    const filePath = await uploadFile.saveFile(
        'user',
        file.data,
        file.name,
        `users/${userId}/profile`,
        ['.jpg', '.jpeg', '.png',],
        2
    );

    await user.update({ photo: filePath });

    return user;

}

export default {
    getAllUsers,
    createUser,
    showUser,
    updateUser,
    removeUser,
    getUserBoats,
    getUserReservations,
    getUserMessages,
    getUserReviews,
    getUserDocuments,
    uploadUserPhoto
};
