const express = require('express');
const router = express.Router({ mergeParams: true });


/* GET reviews index  /post/:id/reviews */
router.get('/', function (req, res, next) {
    res.send('INDEX /post/:id/reviews');
});

/* POST reviews create  /post/:id/reviews */
router.post('/', function (req, res, next) {
    res.send('CREATE /post/:id/reviews');
});

/* GET reviews edit  /post/:id/reviews/:review_id/edit */
router.get('/:review_id/edit', function (req, res, next) {
    res.send('EDIT /post/:id/reviews/:review_id/edit');
});

/* PUT reviews update  /post/:id/reviews/:review_id */
router.put('/:review_id', function (req, res, next) {
    res.send('UPDATE /post/:id/reviews/:review_id');
});

/* DELETE reviews destroy  /post/:id/reviews/:review_id */
router.delete('/:review_id', function (req, res, next) {
    res.send('DELETE /post/:id/reviews/:review_id');
});

module.exports = router;


  // Get index /reviews
  // Get new   /reviews/new
  // Post create /reviews
  // Get show    /reviews/:id
  // get edit    /reviews/:id/edit
  // put update  /reviews/:id
  // delete destroy /reviews/:id