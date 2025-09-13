import contractService from '../services/contract.services.js';

const index = async (req, res) => {
  try {
    const contracts = await contractService.getAllContracts();
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  
  try {
    
    let data = {};
    if (req.body.data) {
      try {
        data = JSON.parse(req.body.data);
      } catch (e) {
        return res.status(400).json({ error: "JSON invalide dans 'data'" });
      }
    } else {
      return res.status(400).json({ error: "Le champ 'data' est manquant" });
    }
    
    req.body = data;
    
    const contract = req.files?.contract_pdf;
    const result = await contractService.createContract(req.body, {
      contract_pdf: contract
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const show = async (req, res) => {
  try {
    const result = await contractService.getContractById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const result = await contractService.updateContract(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await contractService.deleteContract(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReservationContract = async (req, res) => {
  try {
    const result = await contractService.getReservationContract(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  index, create, show, update, remove,
  getReservationContract
};