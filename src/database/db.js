const knex = require('knex');
const knexConfig = require('../knexfile');
const environment = process.env.ENVIRONMENT || 'development';

module.exports = knex(knexConfig[environment]);
