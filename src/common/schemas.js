const Joi = require('joi');

const schemas = {
  getContractById: Joi.object().keys({
    id: Joi.number().min(1).required(),
  }),
  payJob: Joi.object().keys({
    job_id: Joi.number().min(1).required(),
  }),
  depositParams: Joi.object().keys({
    userId: Joi.number().min(1).required(),
  }),
  depositBody: Joi.object().keys({
    amount: Joi.number().min(1).required(),
  }),
  getBestProfession: Joi.object().keys({
    start: Joi.date().required(),
    end: Joi.date().required(),
  }),
  getBestClients: Joi.object().keys({
    start: Joi.date().required(),
    end: Joi.date().required(),
    limit: Joi.number().min(1).optional(),
  }),
};

module.exports = { schemas };
