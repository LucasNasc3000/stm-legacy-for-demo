const { logger } = require('sequelize/lib/utils/logger');
const { default: SecretsHandler } = require('../secretsHandler');

require('dotenv').config();

const getDbName = SecretsHandler('dbName');
const getDbHostIp = SecretsHandler('dbHost');
const getDbPort = SecretsHandler('dbPort');
const getdbUser = SecretsHandler('dbUser');
const getDbPass = SecretsHandler('dbPass');

module.exports = {
  dialect: 'mysql',
  logger,
  host: getDbHostIp,
  port: getDbPort,
  username: getdbUser,
  password: getDbPass,
  database: getDbName,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  dialectOptions: {
    timezone: '+03:00',
  },
  timezone: '+03:00',
};
