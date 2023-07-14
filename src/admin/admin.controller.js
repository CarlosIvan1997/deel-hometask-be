const express = require('express');
const { requestValidator } = require('../common/middleware/requestValidator');
const { schemas } = require('../common/schemas');
const { getBestProfession, getBestClients } = require('./admin.service');

const adminController = express.Router();

adminController.get(
  '/best-profession',
  requestValidator(schemas.getBestProfession, 'query'),
  async (req, res, next) => {
    try {
      const bestProfession = await getBestProfession(req);

      res.json(bestProfession);
    } catch (error) {
      next(error);
    }
  }
);

adminController.get(
  '/best-clients',
  requestValidator(schemas.getBestClients, 'query'),
  async (req, res, next) => {
    try {
      const bestClients = await getBestClients(req);

      res.json(bestClients);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = adminController;
