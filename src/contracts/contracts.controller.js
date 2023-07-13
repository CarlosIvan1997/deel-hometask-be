const express = require('express');
const { getProfile } = require('../common/middleware/getProfile');
const { requestValidator } = require('../common/middleware/requestValidator');
const { schemas } = require('../common/schemas');
const { getContractById, getContracts } = require('./contracts.service');

const contractsController = express.Router();

contractsController.get(
  '/:id',
  [getProfile, requestValidator(schemas.getContractById, 'params')],
  async (req, res, next) => {
    try {
      const contract = await getContractById(req);

      if (!contract) return res.status(404).end();

      res.json(contract);
    } catch (error) {
      next(error);
    }
  }
);

contractsController.get('/', getProfile, async (req, res, next) => {
  try {
    const contracts = await getContracts(req);

    res.json(contracts);
  } catch (error) {
    next(error);
  }
});

module.exports = contractsController;
