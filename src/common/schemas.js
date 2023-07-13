const Joi = require('joi');

const schemas = {
  getContractById: Joi.object().keys({
    id: Joi.number().min(1).required(),
  }),
  payJob: Joi.object().keys({
    job_id: Joi.number().min(1).required(),
  }),
};

module.exports = { schemas };
