const express = require('express');
const { errorHandler } = require('./common/middleware/errorHandler');
const contractsController = require('./contracts/contracts.controller');
const jobsController = require('./jobs/jobs.controller');
const balancesController = require('./balances/balances.controller');
const adminController = require('./admin/admin.controller');

const router = express.Router();

router.get('/', async (req, res) => {
  res.json('Welcome to Deel Hometask BE');
});
router.use('/contracts', contractsController);
router.use('/jobs', jobsController);
router.use('/balances', balancesController);
router.use('/admin', adminController);
router.use(errorHandler);

module.exports = router;
