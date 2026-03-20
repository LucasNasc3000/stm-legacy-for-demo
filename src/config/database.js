// const { logger } = require('sequelize/lib/utils/logger');
// const { default: SecretsHandler } = require('../secretsHandler');

require('dotenv').config();

// const getDbName = SecretsHandler('dbName');
// const getDbHostIp = SecretsHandler('dbHost');
// const getDbPort = SecretsHandler('dbPort');
// const getdbUser = SecretsHandler('dbUser');
// const getDbPass = SecretsHandler('dbPass');

module.exports = {
  dialect: 'mysql',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  dialectOptions: {
    timezone: '+03:00',
    ssl: {
      rejectUnauthorized: true,
    },
  },
  timezone: '+03:00',
};
