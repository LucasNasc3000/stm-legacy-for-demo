"use strict";const { default: SecretsHandler } = require('../secretsHandler');

require('dotenv').config();

const getDbName = SecretsHandler('dbHost');
const getDbHostIp = SecretsHandler('dbHostIp');
const getDbPort = SecretsHandler('dbPort');
const getdbUser = SecretsHandler('dbUser');
const getDbPass = SecretsHandler('dbPass');

module.exports = {
  dialect: 'mysql',
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
