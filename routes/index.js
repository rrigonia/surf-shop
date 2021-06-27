const express = require('express');
const router = express.Router();
const { postRegister, index, getRegister } = require('../controllers/index');

/* GET home page. */
router.get('/', index);

/* GET /register */
router.get('/register', getRegister);

/* POST /register */
router.post('/register', postRegister);

/* GET /login */
router.get('/login', function (req, res, next) {
  res.send('GET /login');
});

/* POST /login */
router.post('/login', function (req, res, next) {
  res.send('POST /login');
});

/* GET /profile */
router.get('/profile', function (req, res, next) {
  res.send('GET /profile');
});

/* PUT /profile/:user_id */
router.put('/profile/:user_id', function (req, res, next) {
  res.send('PUT /profile/:user_id');
});

/* GET /forgot */
router.get('/forgot', function (req, res, next) {
  res.send('GET /forgot');
});

/* PUT /forgot */
router.put('/forgot', function (req, res, next) {
  res.send('PUT /forgot');
});

/* GET /reset/:token */
router.get('/reset/:token', function (req, res, next) {
  res.send('GET /reset/:token');
});

/* PUT /reset/:token */
router.put('/reset/:token', function (req, res, next) {
  res.send('PUT /reset/:token');
});


module.exports = router;
