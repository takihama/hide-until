const snakeToCamel = (str) => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

const snakeToCamelKeys = (row) => {
  const convertedRow = {};
  for (const [key, value] of Object.entries(row)) {
    convertedRow[snakeToCamel(key)] = value;
  }
  return convertedRow;
};

module.exports = {
  snakeToCamelKeys
};
