const express = require('express');
const router = express.Router();
const { submitForm } = require('../controllers/contactFormController');

router.post('/', submitForm);

module.exports = router;
