const express = require('express');
const {wrapAsync, isReviewAuthor} = require('../middleware');
const {reviewCreate, reviewUpdate, reviewDestroy} = require('../controllers/reviews');
const router = express.Router({ mergeParams: true });


/* POST reviews create  /post/:id/reviews */
router.post('/', wrapAsync(reviewCreate));

/* PUT reviews update  /post/:id/reviews/:review_id */
router.put('/:review_id',isReviewAuthor, wrapAsync(reviewUpdate));

/* DELETE reviews destroy  /post/:id/reviews/:review_id */
router.delete('/:review_id', isReviewAuthor, wrapAsync(reviewDestroy));

module.exports = router;