import userService from "../services/user.services.js";

const index = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const show = async (req, res) => {
  try {
    const user = await userService.showUser(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await userService.removeUser(req.params.id);
    if (!result)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserBoats = async (req, res) => {
  try {
    const boats = await userService.getUserBoats(req.params.id);
    res.status(200).json(boats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserReservations = async (req, res) => {
  try {
    const reservations = await userService.getUserReservations(req.params.id);
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserMessages = async (req, res) => {
  try {
    const messages = await userService.getUserMessages(req.params.id);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const reviews = await userService.getUserReviews(req.params.id);
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserDocuments = async (req, res) => {
  try {
    const documents = await userService.getUserDocuments(req.params.id);
    res.status(200).json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uploadPhoto = async (req, res) => {
  try {
    if (!req.files || !req.files.photo) {
      return res.status(400).json({ message: "Aucune photo fournie" });
    }
    const photo = await userService.uploadUserPhoto(
      req.params.id,
      req.files.photo
    );
    res.status(200).json(photo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  index,
  create,
  show,
  update,
  remove,
  getUserBoats,
  getUserReservations,
  getUserMessages,
  getUserReviews,
  getUserDocuments,
  uploadPhoto,
};
