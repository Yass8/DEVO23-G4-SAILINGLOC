import { Op } from "sequelize";
import db from "../models/index.js";
const { BoatEquipment, Boat } = db;

const getAllBoatEquipments = async () => {
  return await BoatEquipment.findAll({
    include: Boat
  });
};

const createBoatEquipment = async (data) => {
  return await BoatEquipment.bulkCreate(data);
};

const getBoatEquipmentById = async (id) => {
  return await BoatEquipment.findByPk(id, {
    include: Boat
  });
};

const updateBoatEquipment = async (id, data) => {
  const equipment = await BoatEquipment.findByPk(id);
  if (!equipment) return null;
  return await equipment.update(data);
};

const deleteBoatEquipment = async (id) => {
  const equipment = await BoatEquipment.findByPk(id);
  if (!equipment) return null;
  await equipment.destroy();
  return true;
};

const getBoatEquipments = async (boatId) => {
  return await BoatEquipment.findAll({
    where: { boat_id: boatId }
  });
};

const syncBoatEquipments = async (boatId, equipmentNames) => {
  const t = await db.sequelize.transaction();

  try {
    await BoatEquipment.destroy({
      where: {
        boat_id: boatId,
        equipment_name: { [Op.notIn]: equipmentNames },
      },
      transaction: t,
    });

    const existing = await BoatEquipment.findAll({
      where: { boat_id: boatId },
      transaction: t,
    });
    const existingNames = existing.map(e => e.equipment_name);

    const toAdd = equipmentNames.filter(name => !existingNames.includes(name));

    if (toAdd.length) {
      const data = toAdd.map(name => ({
        boat_id: boatId,
        equipment_name: name,
      }));
      await BoatEquipment.bulkCreate(data, { transaction: t });
    }

    await t.commit();
    return true;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

export default {
  getAllBoatEquipments,
  createBoatEquipment,
  getBoatEquipmentById,
  updateBoatEquipment,
  deleteBoatEquipment,
  getBoatEquipments,
  syncBoatEquipments
};