const User = require('../models/user')

module.exports.renderSignUpForm = (req, res) => {
    res.render('users/signup')
}

module.exports.createUser = async (req, res, next) => {
    try {
        const { username, password, email } = req.body
        const user = await User.register(new User({ username, email }), password)
        req.login(user, (err) => {
            if (err) {
                return next(err)
            } else {
                req.flash('success', 'Welcome to W2 LEED Projects Map')
                res.redirect('/projects')
            }
        })

    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/signup')
    }
}

module.exports.renderSigninForm = (req, res) => {
    res.render('users/signin')
}

module.exports.authenticate = (req, res) => {
    const url = req.session.previousUrl || '/projects'
    delete (req.session.previousUrl)
    res.redirect(url)
}

module.exports.signout = (req, res) => {
    req.logout()
    req.flash('success', 'You have signed out. Goodbye')
    res.redirect('/projects')
}