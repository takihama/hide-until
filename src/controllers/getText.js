const { isValidUUID } = require('../utils/isValidUUID');
const { getHiddenText } = require('../providers/getHiddenText');

const getText = async (req, res) => {
  if (!isValidUUID(req.params.uuid)) {
    return res.status(400).json();
  }

  const hiddenText = await getHiddenText({ uuid: req.params.uuid });

  if (!hiddenText) {
    return res.status(404).send('Hidden text not found');
  }

  if (hiddenText.expirationTime > new Date()) {
    return res.json({
      uuid: hiddenText.uuid,
      expirationTime: hiddenText.expirationTime,
      isHidden: true
    });
  }

  return res.json({
    uuid: hiddenText.uuid,
    text: hiddenText.text,
    expirationTime: hiddenText.expirationTime,
    isHidden: false
  });
};

module.exports = { getText };
