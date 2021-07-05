const express = require('express');
const router = express.Router({ mergeParams: true });


/* POST reviews create  /post/:id/reviews */
router.post('/', function (req, res, next) {
    res.send('CREATE /post/:id/reviews');
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