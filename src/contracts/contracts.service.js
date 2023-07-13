const { Op } = require('sequelize');
const { CONTRACT_STATUS } = require('../common/constants');

const getContractById = async (req) => {
  const { Contract } = req.app.get('models');
  const { id } = req.params;
  const { profile, profileTypeKey } = req;

  return await Contract.findOne({
    where: { id, [profileTypeKey]: profile.id },
  });
};

const getContracts = async (req) => {
  const { Contract } = req.app.get('models');
  const { profile, profileTypeKey } = req;

  return await Contract.findAll({
    where: {
      [profileTypeKey]: profile.id,
      status: { [Op.ne]: CONTRACT_STATUS.TERMINATED },
    },
  });
};

module.exports = { getContractById, getContracts };
