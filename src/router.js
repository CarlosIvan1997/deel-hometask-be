const express = require('express');
const { getProfile } = require('./common/middleware/getProfile');
const { errorHandler } = require('./common/middleware/errorHandler');
const contractsController = require('./contracts/contracts.controller');

const router = express.Router();

router.get('/', async (req, res) => {
  res.json('Welcome to Deel Hometask BE');
});
router.use(getProfile);
router.use('/contracts', contractsController);
router.use(errorHandler);

module.exports = router;
