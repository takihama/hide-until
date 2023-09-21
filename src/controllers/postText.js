const { validationResult } = require('express-validator');
const { createHiddenText } = require('../providers/createHiddenText');

const postText = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const hiddenText = await createHiddenText({
    text: req.body.text,
    expirationTime: req.body.expirationTime
  });

  if (!hiddenText) {
    return res.status(500);
  }

  res.json(hiddenText);
};

module.exports = { postText };
