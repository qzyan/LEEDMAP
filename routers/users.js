const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')

const users = require('../controllers/users')

router.route('/signup')
    .get(users.renderSignUpForm)
    .post(catchAsync(users.createUser))

router.route('/signin')
    .get(users.renderSigninForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/signin' }), users.authenticate)

router.get('/signout', users.signout)
module.exports = router