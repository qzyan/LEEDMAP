const express = require('express')
const router = express.Router({ mergeParams: true })           //by default, express will keep parent router and child router params seperate
const Review = require('../models/review')
const Project = require('../models/leedprojectmodel');
const catchAsync = require('../utils/catchAsync')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware/middleware')
const reviews = require('../controllers/reviews')

router.route('/')
    .get(reviews.index)
    .post(isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.route('/:reviewId')
    .get(reviews.showReview)
    .delete(isLoggedIn, isReviewAuthor, catchAsync(reviews.destroyReview))

module.exports = router
