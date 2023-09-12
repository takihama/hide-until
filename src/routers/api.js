const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getText } = require('../controllers/getText');
const { postText } = require('../controllers/postText');

const textValidation = body('text')
  .notEmpty()
  .withMessage('Text field is required')
  .isLength({ max: 255 }) // Replace 255 with your desired maximum length
  .withMessage('Text must be shorter than 255 characters');
const expirationTimeValidation = body('expirationTime')
  .notEmpty()
  .isISO8601()
  .withMessage('Invalid date format');

router.use('/api', (req, _, next) => {
  console.log(`Time: ${new Date().toString()}`);
  console.log(`Params: ${req.params}`);
  next();
});
  
router.post('/api', [textValidation, expirationTimeValidation], postText);

router.get('/api/:uuid', getText);

module.exports = router;
