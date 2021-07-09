const express = require('express');
const router = express.Router();
const passport = require('passport');
const {wrapAsync, isLoggedIn} = require('../middleware')
const {
   postRegister,
   getRegister,
   index,
   postLogin,
   getLogin,
   getLogout,
   getProfile } = require('../controllers');

/* GET home page. */
router.get('/', index);

// REGISTER ROUTE
router.route('/register')
  .get(getRegister)
  .post(wrapAsync(postRegister));


/* GET /login */
router.get('/login', getLogin);

/* POST /login */
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
   failureFlash: 'Incorrect username or password'
  }), wrapAsync(postLogin));

// GET /logout
router.get('/logout', getLogout);

/* GET /profile */
router.get('/profile', isLoggedIn, wrapAsync(getProfile));

/* PUT /profile/:user_id */
router.put('/profile/:user_id', (req, res, next) => {
  res.send('PUT /profile/:user_id');
});

/* GET /forgot */
router.get('/forgot', (req, res, next) => {
  res.send('GET /forgot');
});

/* PUT /forgot */
router.put('/forgot', (req, res, next) => {
  res.send('PUT /forgot');
});

/* GET /reset/:token */
router.get('/reset/:token', (req, res, next) => {
  res.send('GET /reset/:token');
});

/* PUT /reset/:token */
router.put('/reset/:token', (req, res, next) => {
  res.send('PUT /reset/:token');
});


module.exports = router;
