const { Op } = require('sequelize');
const { CONTRACT_STATUS } = require('../common/constants');
const { PROFILE_TYPE } = require('../common/constants');
const { buildCustomError } = require('../common/buildCustomError');

const deposit = async (req) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const sequelize = req.app.get('sequelize');
  const { userId } = req.params;
  const { amount } = req.body;

  const client = await Profile.findOne({
    where: { id: userId, type: PROFILE_TYPE.CLIENT.toLowerCase() },
  });

  if (!client) {
    buildCustomError(404, 'Could not find client');
  }

  const unpaidSum = await Job.sum('price', {
    include: [
      {
        model: Contract,
        required: true,
        attributes: [],
        where: {
          ClientId: userId,
          status: CONTRACT_STATUS.IN_PROGRESS,
        },
      },
    ],
    where: {
      [Op.or]: [{ paid: false }, { paid: null }],
    },
  });

  if (amount > unpaidSum * 0.25) {
    buildCustomError(400, 'The deposit exceeds the allowed amount');
  }

  return await sequelize.transaction(async (transaction) => {
    client.balance += amount;

    await client.save({ transaction });

    return { success: true };
  });
};

module.exports = { deposit };
