var _ = require('lodash')
var async = require('async')
var crypto = require('crypto')
var nodemailer = require('nodemailer')
var passport = require('passport')
var mongoose = require('mongoose')
var User = mongoose.model('User')
var secrets = {
  user: process.env.SENDGRID_USER || 'hslogin',
  password: process.env.SENDGRID_PASSWORD || 'hspassword00'
}

/**
 * GET /login
 * Login page.
 */
exports.getLogin = function (req, res) {
  if (req.user) {
    return res.status(200).send(req.user)
  }
  res.status(200).send({authenticated: false,redirect: req.session.returnTo})
}

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = function (req, res, next) {
  req.assert('email', 'Email is not valid').isEmail()
  req.assert('password', 'Password cannot be blank').notEmpty()

  var errors = req.validationErrors()
  console.log(errors, 'errors')
  if (errors) {
    return res.redirect('/login')
  }

  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err)
    }
    console.log(err, user, info)
    if (!user) {
      return res.status(400).send(info.message)
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err)
      }
      // req.flash('success', { msg: 'Success! You are logged in.' })
      // res.redirect(req.session.returnTo || '/')
      // delete user.password
      // delete user._id
      return res.status(200).send(user)
    })
  })(req, res, next)
}

/**
 * GET /logout
 * Log out.
 */
exports.logout = function (req, res) {
  console.log('logggggo out')
  req.logout()
  res.redirect('/')
}

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = function (req, res) {
  if (req.user) {
    return res.redirect('/')
  }
  res.redirect('/account/signup')
}

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = function (req, res, next) {
  req.assert('email', 'Email is not valid').isEmail()
  req.assert('password', 'Password must be at least 4 characters long').len(4)
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password)

  var errors = req.validationErrors()

  if (errors) {
    // req.flash('errors', errors)
    return res.redirect('/signup')
  }

  var user = new User({
    email: req.body.email,
    password: req.body.password,
    profile: {
      name: req.body.profile.name
    }
  })

  User.findOne({ email: req.body.email }, function (err, existingUser) {
    if (existingUser) {
      // req.flash('errors', { msg: 'Account with that email address already exists.' })
      return res.redirect('/signup')
    }
    user.save(function (err) {
      if (err) {
        return next(err)
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err)
        }
        res.redirect('/')
      })
    })
  })
}

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = function (req, res) {
  res.redirect('/account/profile')
}

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = function (req, res, next) {
  User.findById(req.user.id, function (err, user) {
    if (err) {
      return next(err)
    }
    user = _.merge(user, req.body)
    // user.email = req.body.email || ''
    // user.profile.name = req.body.name || ''
    // user.profile.gender = req.body.gender || ''
    // user.profile.location = req.body.location || ''
    // user.profile.website = req.body.website || ''
    user.save(function (err) {
      if (err) {
        return next(err)
      }
      // req.flash('success', { msg: 'Profile information updated.' })
      res.status(200).send(user)

    })
  })
}

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = function (req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long').len(4)
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password)

  var errors = req.validationErrors()

  if (errors) {
    console.log(errors)
    return res.redirect('/account')
  }

  User.findById(req.user.id, function (err, user) {
    if (err) {
      return next(err)
    }
    user.password = req.body.password
    user.save(function (err) {
      if (err) {
        return next(err)
      }
      req.flash('success', { msg: 'Password has been changed.' })
      res.redirect('/account')
    })
  })
}

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = function (req, res, next) {
  User.remove({ _id: req.user.id }, function (err) {
    if (err) {
      return next(err)
    }
    req.logout()
    res.redirect('/')
  })
}

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  User
    .findOne({ resetPasswordToken: req.params.token })
    .where('resetPasswordExpires').gt(Date.now())
    .exec(function (err, user) {
      if (err) {
        return next(err)
      }
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' })
        return res.redirect('/forgot')
      }
      res.redirect('/account/reset')
    })
}

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = function (req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long.').len(4)
  req.assert('confirm', 'Passwords must match.').equals(req.body.password)

  var errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('back')
  }

  async.waterfall([
    function (done) {
      User
        .findOne({ resetPasswordToken: req.params.token })
        .where('resetPasswordExpires').gt(Date.now())
        .exec(function (err, user) {
          if (err) {
            return next(err)
          }
          if (!user) {
            return res.redirect('back')
          }
          user.password = req.body.password
          user.resetPasswordToken = undefined
          user.resetPasswordExpires = undefined
          user.save(function (err) {
            if (err) {
              return next(err)
            }
            req.logIn(user, function (err) {
              done(err, user)
            })
          })
        })
    },
    function (user, done) {
      var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: secrets.sendgrid.user,
          pass: secrets.sendgrid.password
        }
      })
      var mailOptions = {
        to: user.email,
        from: 'hackathon@starter.com',
        subject: 'Your Hackathon Starter password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      }
      transporter.sendMail(mailOptions, function (err) {
        console.log('success', { msg: 'Success! Your password has been changed.' })
        done(err)
      })
    }
  ], function (err) {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
}

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  res.redirect('/account/forgot')
}

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = function (req, res, next) {
  req.assert('email', 'Please enter a valid email address.').isEmail()

  var errors = req.validationErrors()

  if (errors) {
    return res.redirect('/forgot')
  }

  async.waterfall([
    function (done) {
      crypto.randomBytes(16, function (err, buf) {
        var token = buf.toString('hex')
        done(err, token)
      })
    },
    function (token, done) {
      User.findOne({ email: req.body.email.toLowerCase() }, function (err, user) {
        if (!user) {
          return res.redirect('/forgot')
        }
        user.resetPasswordToken = token
        user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
        user.save(function (err) {
          done(err, token, user)
        })
      })
    },
    function (token, user, done) {
      var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: secrets.sendgrid.user,
          pass: secrets.sendgrid.password
        }
      })
      var mailOptions = {
        to: user.email,
        from: 'hackathon@starter.com',
        subject: 'Reset your password on Hackathon Starter',
        text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      }
      transporter.sendMail(mailOptions, function (err) {
        done(err, 'done')
      })
    }
  ], function (err) {
    if (err) {
      return next(err)
    }
    res.redirect('/forgot')
  })
}
