const express = require('express');
const { getContractById, getContracts } = require('./contracts.service');

const contractsController = express.Router();

contractsController.get('/:id', async (req, res, next) => {
  try {
    const contract = await getContractById(req);

    if (!contract) return res.status(404).end();

    res.json(contract);
  } catch (error) {
    next(error);
  }
});

contractsController.get('/', async (req, res, next) => {
  try {
    const contracts = await getContracts(req);

    res.json(contracts);
  } catch (error) {
    next(error);
  }
});

module.exports = contractsController;
