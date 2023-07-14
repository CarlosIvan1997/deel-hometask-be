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

jest.mock('../model', () => ({
  sequelize: {
    models: {
      Profile: {
        findOne: jest.fn(),
      },
      Job: {
        sum: jest.fn(),
      },
    },
    transaction: jest.fn(),
  },
}));

describe('Balances Controller', () => {
  describe('POST /deposit/:userId', () => {
    it('should make a deposit', async () => {
      sequelize.models.Profile.findOne.mockResolvedValueOnce(mockProfile);
      sequelize.models.Job.sum.mockResolvedValueOnce(100);
      sequelize.transaction.mockResolvedValueOnce({ success: true });

      const response = await request(app)
        .post('/balances/deposit/1')
        .send({ amount: 25 });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ success: true });
    });

    it('should return error because could not find client', async () => {
      sequelize.models.Profile.findOne.mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/balances/deposit/1')
        .send({ amount: 25 });

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({ message: 'Could not find client' });
    });

    it('should return error because amount exceeds the limit', async () => {
      sequelize.models.Profile.findOne.mockResolvedValueOnce(mockProfile);
      sequelize.models.Job.sum.mockResolvedValueOnce(100);

      const response = await request(app)
        .post('/balances/deposit/1')
        .send({ amount: 26 });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        message: 'The deposit exceeds the allowed amount',
      });
    });
  });
});
