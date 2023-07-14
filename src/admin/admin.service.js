const { Op } = require('sequelize');
const { PROFILE_TYPE } = require('../common/constants');

const getBestProfession = async (req) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const sequelize = req.app.get('sequelize');
  const { start, end } = req.query;

  return await Job.findOne({
    include: [
      {
        model: Contract,
        required: true,
        attributes: [],
        include: [
          {
            model: Profile,
            required: true,
            attributes: [],
            as: PROFILE_TYPE.CONTRACTOR,
          },
        ],
      },
    ],
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [start, end],
      },
    },
    attributes: [
      [sequelize.fn('sum', sequelize.col('price')), 'totalPaid'],
      'Contract.Contractor.profession',
    ],
    group: 'profession',
    order: [[sequelize.col('totalPaid'), 'DESC']],
    raw: true,
  });
};

const getBestClients = async (req) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const sequelize = req.app.get('sequelize');
  const { start, end, limit = 2 } = req.query;

  return await Job.findAll({
    include: [
      {
        model: Contract,
        required: true,
        attributes: [],
        include: [
          {
            model: Profile,
            required: true,
            attributes: [],
            as: PROFILE_TYPE.CLIENT,
          },
        ],
      },
    ],
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [start, end],
      },
    },
    attributes: [
      'Contract.Client.id',
      [sequelize.literal("firstName || ' ' || lastName"), 'fullName'],
      [sequelize.fn('sum', sequelize.col('price')), 'totalPaid'],
    ],
    group: 'Contract.Client.id',
    order: [[sequelize.col('totalPaid'), 'DESC']],
    limit,
    raw: true,
  });
};

module.exports = { getBestProfession, getBestClients };
