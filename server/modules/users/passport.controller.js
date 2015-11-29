var _ = require('lodash')
var passport = require('passport')
var InstagramStrategy = require('passport-instagram').Strategy
var LocalStrategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy
var TwitterStrategy = require('passport-twitter').Strategy
var GitHubStrategy = require('passport-github').Strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy
var OAuthStrategy = require('passport-oauth').OAuthStrategy
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy

var secrets = {
  mailgun: {
    user: process.env.MAILGUN_USER || 'postmaster@sandbox697fcddc09814c6b83718b9fd5d4e5dc.mailgun.org',
    password: process.env.MAILGUN_PASSWORD || '29eldds1uri6'
  },

  mandrill: {
    user: process.env.MANDRILL_USER || 'hackathonstarterdemo',
    password: process.env.MANDRILL_PASSWORD || 'E1K950_ydLR4mHw12a0ldA'
  },

  sendgrid: {
    user: process.env.SENDGRID_USER || 'hslogin',
    password: process.env.SENDGRID_PASSWORD || 'hspassword00'
  },

  nyt: {
    key: process.env.NYT_KEY || '9548be6f3a64163d23e1539f067fcabd:5:68537648'
  },

  lastfm: {
    api_key: process.env.LASTFM_KEY || 'c8c0ea1c4a6b199b3429722512fbd17f',
    secret: process.env.LASTFM_SECRET || 'is cb7857b8fba83f819ea46ca13681fe71'
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || '754220301289665',
    clientSecret: process.env.FACEBOOK_SECRET || '41860e58c256a3d7ad8267d3c1939a4a',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
  },

  instagram: {
    clientID: process.env.INSTAGRAM_ID || '9f5c39ab236a48e0aec354acb77eee9b',
    clientSecret: process.env.INSTAGRAM_SECRET || '5920619aafe842128673e793a1c40028',
    callbackURL: '/auth/instagram/callback',
    passReqToCallback: true
  },

  github: {
    clientID: process.env.GITHUB_ID || 'cb448b1d4f0c743a1e36',
    clientSecret: process.env.GITHUB_SECRET || '815aa4606f476444691c5f1c16b9c70da6714dc6',
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
  },

  twitter: {
    consumerKey: process.env.TWITTER_KEY || '6NNBDyJ2TavL407A3lWxPFKBI',
    consumerSecret: process.env.TWITTER_SECRET || 'ZHaYyK3DQCqv49Z9ofsYdqiUgeoICyh6uoBgFfu7OeYC7wTQKa',
    callbackURL: '/auth/twitter/callback',
    passReqToCallback: true
  },

  google: {
    clientID: process.env.GOOGLE_ID || '828110519058.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'JdZsIaWhUFIchmC1a_IZzOHb',
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  },

  linkedin: {
    clientID: process.env.LINKEDIN_ID || '77chexmowru601',
    clientSecret: process.env.LINKEDIN_SECRET || 'szdC8lN2s2SuMSy8',
    callbackURL: process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:3000/auth/linkedin/callback',
    scope: ['r_basicprofile', 'r_emailaddress'],
    passReqToCallback: true
  },

  steam: {
    apiKey: process.env.STEAM_KEY || 'D1240DEF4D41D416FD291D0075B6ED3F'
  },

  twilio: {
    sid: process.env.TWILIO_SID || 'AC6f0edc4c47becc6d0a952536fc9a6025',
    token: process.env.TWILIO_TOKEN || 'a67170ff7afa2df3f4c7d97cd240d0f3'
  },

  clockwork: {
    apiKey: process.env.CLOCKWORK_KEY || '9ffb267f88df55762f74ba2f517a66dc8bedac5a'
  },

  stripe: {
    secretKey: process.env.STRIPE_SKEY || 'sk_test_BQokikJOvBiI2HlWgH4olfQ2',
    publishableKey: process.env.STRIPE_PKEY || 'pk_test_6pRNASCoBOKtIshFeQd4XMUh'
  },

  tumblr: {
    consumerKey: process.env.TUMBLR_KEY || 'FaXbGf5gkhswzDqSMYI42QCPYoHsu5MIDciAhTyYjehotQpJvM',
    consumerSecret: process.env.TUMBLR_SECRET || 'QpCTs5IMMCsCImwdvFiqyGtIZwowF5o3UXonjPoNp4HVtJAL4o',
    callbackURL: '/auth/tumblr/callback'
  },

  foursquare: {
    clientId: process.env.FOURSQUARE_ID || '2STROLSFBMZLAHG3IBA141EM2HGRF0IRIBB4KXMOGA2EH3JG',
    clientSecret: process.env.FOURSQUARE_SECRET || 'UAABFAWTIHIUFBL0PDC3TDMSXJF2GTGWLD3BES1QHXKAIYQB',
    redirectUrl: process.env.FOURSQUARE_REDIRECT_URL || 'http://localhost:3000/auth/foursquare/callback'
  },

  venmo: {
    clientId: process.env.VENMO_ID || '1688',
    clientSecret: process.env.VENMO_SECRET || 'uQXtNBa6KVphDLAEx8suEush3scX8grs',
    redirectUrl: process.env.VENMO_REDIRECT_URL || 'http://localhost:3000/auth/venmo/callback'
  },

  paypal: {
    host: 'api.sandbox.paypal.com',
    client_id: process.env.PAYPAL_ID || 'AdGE8hDyixVoHmbhASqAThfbBcrbcgiJPBwlAM7u7Kfq3YU-iPGc6BXaTppt',
    client_secret: process.env.PAYPAL_SECRET || 'EPN0WxB5PaRaumTB1ZpCuuTqLqIlF6_EWUcAbZV99Eu86YeNBVm9KVsw_Ez5',
    returnUrl: process.env.PAYPAL_RETURN_URL || 'http://localhost:3000/api/paypal/success',
    cancelUrl: process.env.PAYPAL_CANCEL_URL || 'http://localhost:3000/api/paypal/cancel'
  },

  lob: {
    apiKey: process.env.LOB_KEY || 'test_814e892b199d65ef6dbb3e4ad24689559ca'
  },

  bitgo: {
    accessToken: process.env.BITGO_ACCESS_TOKEN || '4fca3ed3c2839be45b03bbd330e5ab1f9b3989ddd949bf6b8765518bc6a0e709'
  }
}
var mongoose = require('mongoose')
var User = mongoose.model('User')

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})

/**
 * Sign in with Instagram.
 */
passport.use(new InstagramStrategy(secrets.instagram, function (req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    User.findOne({ instagram: profile.id }, function (err, existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already an Instagram account that belongs to you. Sign in with that account or delete it, then link it with your current account.' })
        done(err)
      } else {
        User.findById(req.user.id, function (err, user) {
          user.instagram = profile.id
          user.tokens.push({ kind: 'instagram', accessToken: accessToken })
          user.profile.name = user.profile.name || profile.displayName
          user.profile.picture = user.profile.picture || profile._json.data.profile_picture
          user.profile.website = user.profile.website || profile._json.data.website
          user.save(function (err) {
            req.flash('info', { msg: 'Instagram account has been linked.' })
            done(err, user)
          })
        })
      }
    })
  } else {
    User.findOne({ instagram: profile.id }, function (err, existingUser) {
      if (existingUser) {
        return done(null, existingUser)
      }
      var user = new User()
      user.instagram = profile.id
      user.tokens.push({ kind: 'instagram', accessToken: accessToken })
      user.profile.name = profile.displayName
      // Similar to Twitter API, assigns a temporary e-mail address
      // to get on with the registration process. It can be changed later
      // to a valid e-mail address in Profile Management.
      user.email = profile.username + '@instagram.com'
      user.profile.website = profile._json.data.website
      user.profile.picture = profile._json.data.profile_picture
      user.save(function (err) {
        done(err, user)
      })
    })
  }
}))

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, function (email, password, done) {
  email = email.toLowerCase()
  User.findOne({ email: email }, function (err, user) {
    if (!user) {
      return done(null, false, { message: 'Email ' + email + ' not found'})
    }
    user.comparePassword(password, function (err, isMatch) {
      if (isMatch) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Invalid email or password.' })
      }
    })
  })
}))

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy(secrets.facebook, function (req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    User.findOne({ facebook: profile.id }, function (err, existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' })
        done(err)
      } else {
        User.findById(req.user.id, function (err, user) {
          user.facebook = profile.id
          user.tokens.push({ kind: 'facebook', accessToken: accessToken })
          user.profile.name = user.profile.name || profile.displayName
          user.profile.gender = user.profile.gender || profile._json.gender
          user.profile.picture = user.profile.picture || 'https://graph.facebook.com/' + profile.id + '/picture?type=large'
          user.save(function (err) {
            req.flash('info', { msg: 'Facebook account has been linked.' })
            done(err, user)
          })
        })
      }
    })
  } else {
    User.findOne({ facebook: profile.id }, function (err, existingUser) {
      if (existingUser) {
        return done(null, existingUser)
      }
      User.findOne({ email: profile._json.email }, function (err, existingEmailUser) {
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' })
          done(err)
        } else {
          var user = new User()
          user.email = profile._json.email
          user.facebook = profile.id
          user.tokens.push({ kind: 'facebook', accessToken: accessToken })
          user.profile.name = profile.displayName
          user.profile.gender = profile._json.gender
          user.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large'
          user.profile.location = (profile._json.location) ? profile._json.location.name : ''
          user.save(function (err) {
            done(err, user)
          })
        }
      })
    })
  }
}))

/**
 * Sign in with GitHub.
 */
passport.use(new GitHubStrategy(secrets.github, function (req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    User.findOne({ github: profile.id }, function (err, existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a GitHub account that belongs to you. Sign in with that account or delete it, then link it with your current account.' })
        done(err)
      } else {
        User.findById(req.user.id, function (err, user) {
          user.github = profile.id
          user.tokens.push({ kind: 'github', accessToken: accessToken })
          user.profile.name = user.profile.name || profile.displayName
          user.profile.picture = user.profile.picture || profile._json.avatar_url
          user.profile.location = user.profile.location || profile._json.location
          user.profile.website = user.profile.website || profile._json.blog
          user.save(function (err) {
            req.flash('info', { msg: 'GitHub account has been linked.' })
            done(err, user)
          })
        })
      }
    })
  } else {
    User.findOne({ github: profile.id }, function (err, existingUser) {
      if (existingUser) {
        return done(null, existingUser)
      }
      User.findOne({ email: profile._json.email }, function (err, existingEmailUser) {
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with GitHub manually from Account Settings.' })
          done(err)
        } else {
          var user = new User()
          user.email = profile._json.email
          user.github = profile.id
          user.tokens.push({ kind: 'github', accessToken: accessToken })
          user.profile.name = profile.displayName
          user.profile.picture = profile._json.avatar_url
          user.profile.location = profile._json.location
          user.profile.website = profile._json.blog
          user.save(function (err) {
            done(err, user)
          })
        }
      })
    })
  }
}))

// Sign in with Twitter.

passport.use(new TwitterStrategy(secrets.twitter, function (req, accessToken, tokenSecret, profile, done) {
  if (req.user) {
    User.findOne({ twitter: profile.id }, function (err, existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a Twitter account that belongs to you. Sign in with that account or delete it, then link it with your current account.' })
        done(err)
      } else {
        User.findById(req.user.id, function (err, user) {
          user.twitter = profile.id
          user.tokens.push({ kind: 'twitter', accessToken: accessToken, tokenSecret: tokenSecret })
          user.profile.name = user.profile.name || profile.displayName
          user.profile.location = user.profile.location || profile._json.location
          user.profile.picture = user.profile.picture || profile._json.profile_image_url_https
          user.save(function (err) {
            req.flash('info', { msg: 'Twitter account has been linked.' })
            done(err, user)
          })
        })
      }
    })

  } else {
    User.findOne({ twitter: profile.id }, function (err, existingUser) {
      if (existingUser) {
        return done(null, existingUser)
      }
      var user = new User()
      // Twitter will not provide an email address.  Period.
      // But a person’s twitter username is guaranteed to be unique
      // so we can "fake" a twitter email address as follows:
      user.email = profile.username + '@twitter.com'
      user.twitter = profile.id
      user.tokens.push({ kind: 'twitter', accessToken: accessToken, tokenSecret: tokenSecret })
      user.profile.name = profile.displayName
      user.profile.location = profile._json.location
      user.profile.picture = profile._json.profile_image_url_https
      user.save(function (err) {
        done(err, user)
      })
    })
  }
}))

/**
 * Sign in with Google.
 */
passport.use(new GoogleStrategy(secrets.google, function (req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    User.findOne({ google: profile.id }, function (err, existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' })
        done(err)
      } else {
        User.findById(req.user.id, function (err, user) {
          user.google = profile.id
          user.tokens.push({ kind: 'google', accessToken: accessToken })
          user.profile.name = user.profile.name || profile.displayName
          user.profile.gender = user.profile.gender || profile._json.gender
          user.profile.picture = user.profile.picture || profile._json.image.url
          user.save(function (err) {
            req.flash('info', { msg: 'Google account has been linked.' })
            done(err, user)
          })
        })
      }
    })
  } else {
    User.findOne({ google: profile.id }, function (err, existingUser) {
      if (existingUser) {
        return done(null, existingUser)
      }
      User.findOne({ email: profile.emails[0].value }, function (err, existingEmailUser) {
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' })
          done(err)
        } else {
          var user = new User()
          user.email = profile.emails[0].value
          user.google = profile.id
          user.tokens.push({ kind: 'google', accessToken: accessToken })
          user.profile.name = profile.displayName
          user.profile.gender = profile._json.gender
          user.profile.picture = profile._json.image.url
          user.save(function (err) {
            done(err, user)
          })
        }
      })
    })
  }
}))

/**
 * Sign in with LinkedIn.
 */
passport.use(new LinkedInStrategy(secrets.linkedin, function (req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    User.findOne({ linkedin: profile.id }, function (err, existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a LinkedIn account that belongs to you. Sign in with that account or delete it, then link it with your current account.' })
        done(err)
      } else {
        User.findById(req.user.id, function (err, user) {
          user.linkedin = profile.id
          user.tokens.push({ kind: 'linkedin', accessToken: accessToken })
          user.profile.name = user.profile.name || profile.displayName
          user.profile.location = user.profile.location || profile._json.location.name
          user.profile.picture = user.profile.picture || profile._json.pictureUrl
          user.profile.website = user.profile.website || profile._json.publicProfileUrl
          user.save(function (err) {
            req.flash('info', { msg: 'LinkedIn account has been linked.' })
            done(err, user)
          })
        })
      }
    })
  } else {
    User.findOne({ linkedin: profile.id }, function (err, existingUser) {
      if (existingUser) {
        return done(null, existingUser)
      }
      User.findOne({ email: profile._json.emailAddress }, function (err, existingEmailUser) {
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with LinkedIn manually from Account Settings.' })
          done(err)
        } else {
          var user = new User()
          user.linkedin = profile.id
          user.tokens.push({ kind: 'linkedin', accessToken: accessToken })
          user.email = profile._json.emailAddress
          user.profile.name = profile.displayName
          user.profile.location = profile._json.location.name
          user.profile.picture = profile._json.pictureUrl
          user.profile.website = profile._json.publicProfileUrl
          user.save(function (err) {
            done(err, user)
          })
        }
      })
    })
  }
}))

/**
 * Tumblr API OAuth.
 */
passport.use('tumblr', new OAuthStrategy({
  requestTokenURL: 'http://www.tumblr.com/oauth/request_token',
  accessTokenURL: 'http://www.tumblr.com/oauth/access_token',
  userAuthorizationURL: 'http://www.tumblr.com/oauth/authorize',
  consumerKey: secrets.tumblr.consumerKey,
  consumerSecret: secrets.tumblr.consumerSecret,
  callbackURL: secrets.tumblr.callbackURL,
  passReqToCallback: true
},
  function (req, token, tokenSecret, profile, done) {
    User.findById(req.user._id, function (err, user) {
      user.tokens.push({ kind: 'tumblr', accessToken: token, tokenSecret: tokenSecret })
      user.save(function (err) {
        done(err, user)
      })
    })
  }
))

/**
 * Foursquare API OAuth.
 */
passport.use('foursquare', new OAuth2Strategy({
  authorizationURL: 'https://foursquare.com/oauth2/authorize',
  tokenURL: 'https://foursquare.com/oauth2/access_token',
  clientID: secrets.foursquare.clientId,
  clientSecret: secrets.foursquare.clientSecret,
  callbackURL: secrets.foursquare.redirectUrl,
  passReqToCallback: true
},
  function (req, accessToken, refreshToken, profile, done) {
    User.findById(req.user._id, function (err, user) {
      user.tokens.push({ kind: 'foursquare', accessToken: accessToken })
      user.save(function (err) {
        done(err, user)
      })
    })
  }
))

/**
 * Venmo API OAuth.
 */
passport.use('venmo', new OAuth2Strategy({
  authorizationURL: 'https://api.venmo.com/v1/oauth/authorize',
  tokenURL: 'https://api.venmo.com/v1/oauth/access_token',
  clientID: secrets.venmo.clientId,
  clientSecret: secrets.venmo.clientSecret,
  callbackURL: secrets.venmo.redirectUrl,
  passReqToCallback: true
},
  function (req, accessToken, refreshToken, profile, done) {
    User.findById(req.user._id, function (err, user) {
      user.tokens.push({ kind: 'venmo', accessToken: accessToken })
      user.save(function (err) {
        done(err, user)
      })
    })
  }
))

/**
 * Login Required middleware.
 */
exports.isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = function (req, res, next) {
  var provider = req.path.split('/').slice(-1)[0]

  if (_.find(req.user.tokens, { kind: provider })) {
    next()
  } else {
    res.redirect('/auth/' + provider)
  }
}
