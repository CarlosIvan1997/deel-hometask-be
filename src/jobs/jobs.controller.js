const express = require('express');
const { getProfile } = require('../common/middleware/getProfile');
const { requestValidator } = require('../common/middleware/requestValidator');
const { schemas } = require('../common/schemas');
const { getUnpaidJobs, payJob } = require('./jobs.service');

const jobsController = express.Router();

jobsController.get('/unpaid', getProfile, async (req, res, next) => {
  try {
    const jobs = await getUnpaidJobs(req);

    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

jobsController.post(
  '/:job_id/pay',
  [getProfile, requestValidator(schemas.payJob, 'params')],
  async (req, res, next) => {
    try {
      const result = await payJob(req);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = jobsController;
