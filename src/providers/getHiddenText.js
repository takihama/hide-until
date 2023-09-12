const db = require('../database/db');

const getHiddenText = async ({ uuid }) => {
  const hiddenText = await db('hiddentexts').select('*').where({ uuid });

  if (hiddenText && hiddenText.length > 0) {
    return hiddenText[0];
  }
  return null;
};

module.exports = {
  getHiddenText
};
