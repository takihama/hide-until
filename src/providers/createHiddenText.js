const db = require('../database/db');

const createHiddenText = async ({ text, expirationTime }) => {
  const hiddenText = await db('hiddentexts')
    .insert({
      text,
      expirationTime
    })
    .returning('*');

  if (hiddenText && hiddenText.length > 0) {
    return hiddenText[0];
  }
  return null;
};

module.exports = {
  createHiddenText
};
