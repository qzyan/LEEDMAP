const Project = require('../models/leedprojectmodel');
const Review = require('../models/review')
const { projectSchema, reviewSchema } = require('../schemas')
const ExpressError = require('../utils/ExpressError')


const isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.previousUrl = req.originalUrl
        req.flash('error', 'You must sign in')
        return res.redirect('/signin')
    } else {
        next()
    }
}

const isAuthor = async function (req, res, next) {
    const { id } = req.params
    const project = await Project.findById(id).exec()
    if (project && !project.author.equals(req.user._id)) {
        req.flash('error', 'Sorry, you do not have the permission')
        return res.redirect(`/projects/${id}`)
    } else {
        next()
    }
}

const isReviewAuthor = async function (req, res, next) {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (req.user._id.equals(review.author)) {
        next()
    } else {
        req.flash('error', 'You do not have the permission to do that!!')
        res.redirect(`/projects/${id}`)
    }
}

function validateProject(req, res, next) {
    const { error } = projectSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => { return el.message }).join(',')
        throw new ExpressError(message, 400)
    } else {
        next()
    }
}

function validateReview(req, res, next) {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 400)
    } else {
        next()
    }
}
module.exports = { isLoggedIn, isAuthor, validateProject, validateReview, isReviewAuthor }