const express = require('express');
const { errorHandler } = require('./common/middleware/errorHandler');
const contractsController = require('./contracts/contracts.controller');
const jobsController = require('./jobs/jobs.controller');

const router = express.Router();

router.get('/', async (req, res) => {
  res.json('Welcome to Deel Hometask BE');
});
router.use('/contracts', contractsController);
router.use('/jobs', jobsController);
router.use(errorHandler);

module.exports = router;
