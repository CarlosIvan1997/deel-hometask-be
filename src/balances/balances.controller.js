const express = require('express');
const { requestValidator } = require('../common/middleware/requestValidator');
const { schemas } = require('../common/schemas');
const { deposit } = require('./balances.service');

const balancesController = express.Router();

balancesController.post(
  '/deposit/:userId',
  [
    requestValidator(schemas.depositParams, 'params'),
    requestValidator(schemas.depositBody, 'body'),
  ],
  async (req, res, next) => {
    try {
      const result = await deposit(req);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = balancesController;
