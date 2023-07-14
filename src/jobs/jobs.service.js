const { Op } = require('sequelize');
const { CONTRACT_STATUS } = require('../common/constants');
const { PROFILE_TYPE } = require('../common/constants');
const { buildCustomError } = require('../common/buildCustomError');

const getUnpaidJobs = async (req) => {
  const { Contract, Job } = req.app.get('models');
  const { profile, profileTypeKey } = req;

  return await Job.findAll({
    include: [
      {
        model: Contract,
        required: true,
        attributes: [],
        where: {
          [profileTypeKey]: profile.id,
          status: CONTRACT_STATUS.IN_PROGRESS,
        },
      },
    ],
    where: {
      [Op.or]: [{ paid: false }, { paid: null }],
    },
  });
};

const payJob = async (req) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const sequelize = req.app.get('sequelize');
  const { job_id: jobId } = req.params;
  const { profile, profileType, profileTypeKey } = req;

  if (profileType !== PROFILE_TYPE.CLIENT) {
    buildCustomError(403, 'The jobs can be paid only by the clients');
  }

  const job = await Job.findOne({
    include: [
      {
        model: Contract,
        required: true,
        attributes: ['ContractorId'],
        where: {
          [profileTypeKey]: profile.id,
          status: CONTRACT_STATUS.IN_PROGRESS,
        },
      },
    ],
    where: { id: jobId, [Op.or]: [{ paid: false }, { paid: null }] },
  });

  if (!job) {
    buildCustomError(404, 'The job does not exist or has already been paid');
  }

  if (profile.balance < job.price) {
    buildCustomError(400, 'Not enough balance');
  }

  return await sequelize.transaction(async (transaction) => {
    profile.balance -= job.price;

    job.paid = true;
    job.paymentDate = new Date();

    await Promise.all([
      profile.save({ transaction }),
      Profile.update(
        { balance: sequelize.literal(`balance + ${job.price}`) },
        { where: { id: job.Contract.ContractorId } },
        { transaction }
      ),
      job.save({ transaction }),
    ]);

    return { success: true };
  });
};

module.exports = { getUnpaidJobs, payJob };
