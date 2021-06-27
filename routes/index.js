const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Surf Shop - Home' });
});

/* GET /register */
router.get('/register', function(req, res, next) {
  res.send('GET /register');
});

/* POST /register */
router.post('/register', function(req, res, next) {
  res.send('POST /register');
});

/* GET /login */
router.get('/login', function(req, res, next) {
  res.send('GET /login');
});

/* POST /login */
router.post('/login', function(req, res, next) {
  res.send('POST /login');
});

/* GET /profile */
router.get('/profile', function(req, res, next) {
  res.send('GET /profile');
});

/* PUT /profile/:user_id */
router.put('/profile/:user_id', function(req, res, next) {
  res.send('PUT /profile/:user_id');
});

/* GET /forgot */
router.get('/forgot', function(req, res, next) {
  res.send('GET /forgot');
});

/* PUT /forgot */
router.put('/forgot', function(req, res, next) {
  res.send('PUT /forgot');
});

/* GET /reset */
router.get('/reset/:token', function(req, res, next) {
  res.send('GET /reset/:token');
});

/* PUT /reset */
router.put('/reset/:token', function(req, res, next) {
  res.send('PUT /reset/:token');
});


module.exports = router;
