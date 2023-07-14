const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../model');

const mockProfile = {
  id: 1,
  firstName: 'Harry',
  lastName: 'Potter',
  profession: 'Wizard',
  balance: 1150,
  type: 'client',
};

const mockJob = {
  id: 1,
  description: 'work',
  price: 200,
  ContractId: 1,
};

jest.mock('../model', () => ({
  sequelize: {
    models: {
      Profile: {
        findOne: jest.fn(),
      },
      Job: {
        findAll: jest.fn(),
        findOne: jest.fn(),
      },
    },
    transaction: jest.fn(),
  },
}));

describe('Jobs Controller', () => {
  describe('GET /unpaid', () => {
    it('should get unpaid jobs', async () => {
      sequelize.models.Profile.findOne.mockResolvedValueOnce(mockProfile);
      sequelize.models.Job.findAll.mockResolvedValueOnce([mockJob]);

      const response = await request(app).get('/jobs/unpaid');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([mockJob]);
    });
  });

  describe('POST /:job_id/pay', () => {
    it('should pay a job', async () => {
      sequelize.models.Profile.findOne.mockResolvedValueOnce(mockProfile);
      sequelize.models.Job.findOne.mockResolvedValueOnce(mockJob);
      sequelize.transaction.mockResolvedValueOnce({ success: true });

      const response = await request(app).post('/jobs/1/pay');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ success: true });
    });

    it('should return error because profile is not client', async () => {
      sequelize.models.Profile.findOne.mockResolvedValueOnce({
        ...mockProfile,
        type: 'contractor',
      });

      const response = await request(app).post('/jobs/1/pay');

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({
        message: 'The jobs can be paid only by the clients',
      });
    });

    it('should return error because job does not exist', async () => {
      sequelize.models.Profile.findOne.mockResolvedValueOnce(mockProfile);
      sequelize.models.Job.findOne.mockResolvedValueOnce(null);

      const response = await request(app).post('/jobs/1/pay');

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({
        message: 'The job does not exist or has already been paid',
      });
    });

    it('should return error because balance is not enough', async () => {
      sequelize.models.Profile.findOne.mockResolvedValueOnce({
        ...mockProfile,
        balance: 1,
      });
      sequelize.models.Job.findOne.mockResolvedValueOnce(mockJob);

      const response = await request(app).post('/jobs/1/pay');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        message: 'Not enough balance',
      });
    });
  });
});
