require('dotenv').config();
const { camelToSnake } = require('./database/utils/camelToSnake');
const { snakeToCamelKeys } = require('./database/utils/snakeToCamelKeys');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      timezone: 'America/Argentina/Buenos_Aires' // Set to Buenos Aires timezone
    },
    wrapIdentifier: (value, origImpl) => {
      return origImpl(camelToSnake(value));
    },
    postProcessResponse: (result) => {
      if (Array.isArray(result)) {
        return result.map((row) => snakeToCamelKeys(row));
      }
      return snakeToCamelKeys(result);
    }
  }
};
