import db from "../models/index.js";
import uploadFile from "../utils/uploadFile.js";
const { Contract, Reservation } = db;

const getAllContracts = async () => {
  return await Contract.findAll({
    include: Reservation,
  });
};

const createContract = async (data, files) => {
  try {
    const file = files.contract_pdf;
    if (!file) throw new Error("Fichier contract_pdf manquant");

    const contractPath = await uploadFile.saveFile(
      "contract",
      file.data,
      file.name,
      "contracts",
      [".pdf"],
      5
    );

    return await Contract.create({
      reference: data.reference,
      reservation_id: data.reservation_id,
      contract_url: contractPath,
      owner_signature: true,
      render_signature: true,
    });
  } catch (err) {
    console.log(err);
    
    throw new Error("Errrrrreur : ", err.message);
  }
};

const getContractById = async (id) => {
  return await Contract.findByPk(id, {
    include: Reservation,
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
    include: Reservation,
  });
};

export default {
  getAllContracts,
  createContract,
  getContractById,
  updateContract,
  deleteContract,
  getReservationContract,
};
