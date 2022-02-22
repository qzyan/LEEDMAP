const Project = require('../models/leedprojectmodel')
const Review = require('../models/review')

module.exports.index = (req, res) => {
    const { id } = req.params
    res.redirect(`/projects/${id}`)
}

module.exports.createReview = async (req, res, next) => {
    const { id } = req.params
    const project = await Project.findById(id)
    const newReview = new Review(req.body.review)
    newReview.author = req.user._id
    await newReview.save()
    project.reviews.push(newReview)
    await project.save()
    req.flash('success', 'Successfully added a new review')
    res.redirect(`/projects/${id}`)
}

module.exports.showReview = (req, res) => {
    const { id } = req.params
    res.redirect(`/projects/${id}`)
}

module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Project.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted a new review')
    res.redirect(`/projects/${id}`)
}