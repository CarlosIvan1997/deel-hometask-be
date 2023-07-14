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

const mockContract = {
  id: 1,
  terms: 'bla bla bla',
  status: 'terminated',
  ClientId: 1,
  ContractorId: 5,
};

jest.mock('../model', () => ({
  sequelize: {
    models: {
      Profile: {
        findOne: jest.fn(),
      },
      Contract: {
        findOne: jest.fn(),
        findAll: jest.fn(),
      },
    },
  },
}));

describe('Contracts Controller', () => {
  describe('GET /:id', () => {
    it('should get contract by id', async () => {
      sequelize.models.Profile.findOne.mockResolvedValueOnce(mockProfile);
      sequelize.models.Contract.findOne.mockResolvedValueOnce(mockContract);

      const response = await request(app).get('/contracts/1');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockContract);
    });

    it('should return error because contract does not exist', async () => {
      sequelize.models.Profile.findOne.mockResolvedValueOnce(mockProfile);
      sequelize.models.Contract.findOne.mockResolvedValueOnce(null);

      const response = await request(app).get('/contracts/1');

      expect(response.statusCode).toBe(404);
    });

    it('should return error because user does not exist', async () => {
      sequelize.models.Profile.findOne.mockResolvedValueOnce(null);

      const response = await request(app).get('/contracts/1');

      expect(response.statusCode).toBe(401);
    });

    it('should return error because id is not correct', async () => {
      sequelize.models.Profile.findOne.mockResolvedValueOnce(mockProfile);

      const response = await request(app).get('/contracts/a');

      expect(response.statusCode).toBe(422);
    });
  });

  describe('GET /', () => {
    it('should get contracts', async () => {
      sequelize.models.Profile.findOne.mockResolvedValueOnce(mockProfile);
      sequelize.models.Contract.findAll.mockResolvedValueOnce([mockContract]);

      const response = await request(app).get('/contracts');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([mockContract]);
    });
  });
});
