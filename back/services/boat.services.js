import db from "../models/index.js";
const { Boat, User, Port, BoatType, BoatPhoto, BoatEquipment, Availability, Reservation, Review } = db;

const getAllBoats = async () => {
  return await Boat.findAll({
    include: [User, Port, BoatType]
  });
};

const createBoat = async (data) => {
  return await Boat.create(data);
};

const getBoatById = async (id) => {
  return await Boat.findByPk(id, {
    include: [User, Port, BoatType]
  });
};

const updateBoat = async (id, data) => {
  const boat = await Boat.findByPk(id);
  if (!boat) return null;
  return await boat.update(data);
};

const deleteBoat = async (id) => {
  const boat = await Boat.findByPk(id);
  if (!boat) return null;
  await boat.destroy();
  return true;
};

const getBoatPhotos = async (boatId) => {
  return await BoatPhoto.findAll({
    where: { boat_id: boatId }
  });
};

const getBoatEquipments = async (boatId) => {
  return await BoatEquipment.findAll({
    where: { boat_id: boatId }
  });
};

const getBoatAvailabilities = async (boatId) => {
  return await Availability.findAll({
    where: { boat_id: boatId }
  });
};

const getBoatReviews = async (boatId) => {
  return await Review.findAll({
    where: { boat_id: boatId },
    include: User
  });
};

const getBoatReservations = async (boatId) => {
  return await Reservation.findAll({
    where: { boat_id: boatId },
    include: User
  });
};

export default {
  getAllBoats,
  createBoat,
  getBoatById,
  updateBoat,
  deleteBoat,
  getBoatPhotos,
  getBoatEquipments,
  getBoatAvailabilities,
  getBoatReviews,
  getBoatReservations
};