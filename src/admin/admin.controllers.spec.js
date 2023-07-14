const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../model');

jest.mock('../model', () => ({
  sequelize: {
    models: {
      Job: {
        findOne: jest.fn(),
        findAll: jest.fn(),
      },
    },
    fn: jest.fn(),
    col: jest.fn(),
    literal: jest.fn(),
  },
}));

describe('Admin Controller', () => {
  describe('GET /admin/best-profession?start=<date>&end=<date>', () => {
    it('should get best profession', async () => {
      sequelize.models.Job.findOne.mockResolvedValueOnce({
        totalPaid: 2683,
        profession: 'Programmer',
      });

      const response = await request(app).get(
        '/admin/best-profession?start=2020-08-01&end=2020-09-01'
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        totalPaid: 2683,
        profession: 'Programmer',
      });
    });
  });

  describe('GET /admin/best-clients?start=<date>&end=<date>&limit=<integer>', () => {
    it('should get best clients', async () => {
      sequelize.models.Job.findAll.mockResolvedValueOnce([
        { fullName: 'Ash Kethcum', id: 4, totalPaid: 2020 },
        { fullName: 'Mr Robot', id: 2, totalPaid: 442 },
      ]);

      const response = await request(app).get(
        '/admin/best-clients?start=2020-08-01&end=2020-09-01'
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        { fullName: 'Ash Kethcum', id: 4, totalPaid: 2020 },
        { fullName: 'Mr Robot', id: 2, totalPaid: 442 },
      ]);
    });
  });
});
