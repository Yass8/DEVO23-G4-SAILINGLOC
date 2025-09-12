import { Op } from "sequelize";
import db from "../models/index.js";
const { Boat, User, Port, BoatType, BoatPhoto, BoatEquipment, Availability, Reservation, Review } = db;
import uploadFile from "../utils/uploadFile.js";

const getAllBoats = async () => {
  return await Boat.findAll({
    include: [User, Port, BoatType]
  });
};

const createBoat = async (data, files) => {
  try {
    
    const bateau = await Boat.create(data);

    const insurancePath = await uploadFile.saveFile(
      "boat",
      files.insurance_url.data,
      files.insurance_url.name,
      `boats/${bateau.id}/insurances`,
      [".jpg", ".jpeg", ".png", ".pdf"],
      5
    );

    const registrationPath = await uploadFile.saveFile(
      "boat",
      files.registration_url.data,
      files.registration_url.name,
      `boats/${bateau.id}/registration`,
      [".jpg", ".jpeg", ".png", ".pdf"],
      5
    );

    await bateau.update({
      insurance_url: insurancePath,
      registration_url: registrationPath,
    });

    return bateau;
  } catch (error) {
    console.error("ERREUR DANS createBoat :", error);
    throw error;
  }
};

const getBoatById = async (id) => {
  return await Boat.findByPk(id, {
    include: [User, Port, BoatType]
  });
};

const getBoatBySlug = async (slug) => {
  return await Boat.findOne({
    where: { slug },
    include: [
      { model: Port, attributes: ["id", "name", "city"] },
      { model: BoatType, attributes: ["id", "name"] },
      { model: BoatPhoto, attributes: ["id", "photo_url", "is_main"] },
      { model: BoatEquipment, attributes: ["id", "equipment_name"] },

      {
        model: Availability,
        attributes: ["id", "start_date", "end_date", "status"],
        where: {
          end_date: { [Op.gte]: new Date() }
        }
      }
    ]
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

const getFilteredBoats = async ({
  startDate,
  endDate,
  port,
  type,
  capacity,
  price,
  length,
  search,
  page = 0,
  limit = 9,
}) => {
  const offset = page * limit;

  const whereClause = {};

  if (search) {
    whereClause.name = { [Op.like]: `%${search}` };
  }

  // filtres numériques
  if (length) whereClause.length = { [Op.lte]: Number(length) };
  if (capacity) {
    whereClause.max_passengers = {
      [Op.or]: [
        { [Op.lte]: Number(capacity) },
        { [Op.is]: null },
      ],
    };
  }
  if (price) whereClause.daily_price = { [Op.lte]: Number(price) };

  // filtre par port
  if (port) whereClause.port_id = Number(port);

  // filtre par type
  if (type && type !== "all") whereClause.type_id = Number(type);

  // filtre par disponibilité
  const includeAvailability =
    startDate && endDate
      ? {
        model: Availability,
        where: {
          status: "available",
          start_date: { [Op.lte]: new Date(startDate) },
          end_date: { [Op.gte]: new Date(endDate) },
        },
        required: true,
      }
      : null;

  const include = [
    { model: Port, attributes: ["id", "name", "city"] },
    { model: BoatType, attributes: ["id", "name"] },
    { model: BoatPhoto, attributes: ['id', 'photo_url', 'is_main'] },
    ...(includeAvailability ? [includeAvailability] : []),
  ];

  const { count, rows } = await Boat.findAndCountAll({
    where: whereClause,
    include,
    limit: Number(limit),
    offset: Number(offset),
    order: [["daily_price", "ASC"]],
    distinct: true,
  });

  return {
    total: count,
    boats: rows,
    page: Number(page),
    pages: Math.ceil(count / limit),
  };
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
  getBoatReservations,
  getBoatBySlug,
  getFilteredBoats
};