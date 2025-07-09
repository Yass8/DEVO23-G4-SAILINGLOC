const index = async (req, res) => { res.json([]); };
const create = async (req, res) => {};
const show = async (req, res) => {};
const update = async (req, res) => {};
const remove = async (req, res) => {};
const getBoatPhotos = async (req, res) => {};
const getBoatEquipments = async (req, res) => {};
const getBoatAvailabilities = async (req, res) => {};
const getBoatReviews = async (req, res) => {};
const getBoatReservations = async (req, res) => {};

export default {
  index, create, show, update, remove,
  getBoatPhotos, getBoatEquipments, getBoatAvailabilities, getBoatReviews, getBoatReservations
};