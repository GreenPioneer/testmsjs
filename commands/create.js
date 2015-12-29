#!/usr/bin/env node

'use strict'
var inquirer = require('inquirer')
var chalk = require('chalk')
var _ = require('lodash')
var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')
var settings = require('../configs/settings.js')
var fs = require('fs')
var path = require('path')
var shell = require('shelljs')
mongoose.connect(settings.db, settings.dbOptions)
mongoose.connection.on('error', function () {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.')
  process.exit(1)
})
mongoose.Promise = Promise
var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: {
    type: String
  },
  tokens: {
    type: Array
  },
  roles: {
    type: Array,
    default: []
  },
  profile: {
    name: {
      type: String,
      default: ''
    },
    gender: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    website: {
      type: String,
      default: ''
    },
    picture: {
      type: String,
      default: ''
    }
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
})
/**
 * Password hash middleware.
 */
userSchema.pre('save', function (next) {
  var user = this
  if (!user.isModified('password')) {
    return next()
  }
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err)
    }
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err)
      }
      user.password = hash
      next()
    })
  })
})
var User = mongoose.model('User', userSchema)
// var questions = [
//   {
//     type: 'list',
//     name: 'theme',
//     message: 'What do you want to do?',
//     choices: [
//       'Order a pizza',
//       'Make a reservation',
//       new inquirer.Separator(),
//       'Ask opening hours',
//       'Talk to the receptionnist'
//     ]
//   },
//   {
//     type: 'list',
//     name: 'size',
//     message: 'What size do you need',
//     choices: [ 'Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro' ],
//     filter: function (val) { return val.toLowerCase(); }
//   },
//   {
//     type: 'confirm',
//     name: 'bacon',
//     message: 'Do you like bacon?'
//   },
//   {
//     type: 'input',
//     name: 'favorite',
//     message: 'Bacon lover, what is your favorite type of bacon?',
//     when: function (answers) {
//       return answers.bacon
//     }
//   },
//   {
//     type: 'confirm',
//     name: 'pizza',
//     message: 'Ok... Do you like pizza?',
//     when: function (answers) {
//       return !likesFood('bacon')(answers)
//     }
//   },
//   {
//     type: 'input',
//     name: 'favorite',
//     message: 'Whew! What is your favorite type of pizza?',
//     when: likesFood('pizza')
//   },
//   {
//     type: 'password',
//     message: 'Enter your git password',
//     name: 'password'
//   },
//   {
//     type: 'input',
//     name: 'first_name',
//     message: "What's your first name",
//     default: function () { return 'Jason' }
//   },
//   {
//     type: 'input',
//     name: 'last_name',
//     message: "What's your last name",
//     default: function () { return 'Doe' }
//   },
//   {
//     type: 'input',
//     name: 'phone',
//     message: "What's your phone number",
//     validate: function (value) {
//       var pass = value.match(/^([01]{1})?[\-\.\s]?\(?(\d{3})\)?[\-\.\s]?(\d{3})[\-\.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i)
//       if (pass) {
//         return true
//       } else {
//         return 'Please enter a valid phone number'
//       }
//     },
//     default: function () { return '2392851674' }
//   },
//   {
//     type: 'checkbox',
//     message: 'Select toppings',
//     name: 'toppings',
//     choices: [
//       new inquirer.Separator('The usual:'),
//       {
//         name: 'Peperonni'
//       },
//       {
//         name: 'Cheese',
//         checked: true
//       },
//       {
//         name: 'Mushroom'
//       },
//       new inquirer.Separator('The extras:'),
//       {
//         name: 'Pineapple'
//       },
//       {
//         name: 'Bacon'
//       },
//       {
//         name: 'Olives',
//         disabled: 'out of stock'
//       },
//       {
//         name: 'Extra cheese'
//       }
//     ],
//     validate: function (answer) {
//       if (answer.length < 1) {
//         return 'You must choose at least one topping.'
//       }
//       return true
//     }
//   }
// ]

// function likesFood (aFood) {
//   return function (answers) {
//     return answers[ aFood ]
//   }
// }
// inquirer.prompt(questions, function (answers) {
//   console.log(JSON.stringify(answers, null, '  '))

//   inquirer.prompt({
//     type: 'list',
//     name: 'chocolate',
//     message: "What's your favorite chocolate?",
//     choices: [ 'Mars', 'Oh Henry', 'Hershey' ]
//   }, function (answers) {
//     console.log(answers)
//     inquirer.prompt({
//       type: 'list',
//       name: 'beverage',
//       message: 'And your favorite beverage?',
//       choices: [ 'Pepsi', 'Coke', '7up', 'Mountain Dew', 'Red Bull' ]
//     })
//   })
// })
// ,
//   {
//     type: 'confirm',
//     name: 'askAgain',
//     message: 'Want to do another action (just hit enter for YES)?',
//     default: true
//   }
// var output = []
// inquirer.prompt(questions, function (answers) {
//   output.push(answers)
//   console.log(answers)
//   if (answers.askAgain) {
//     ask()
//   } else {
//     console.log('Your favorite TV Shows:', output.join(', '))
//   }
// })

function emptyDirectory (url, callback) {
  fs.readdir('./' + url, function (err, files) {
    if (err && err.code !== 'ENOENT') throw new Error(err)
    callback(!files || !files.length)
  })
}
function readDirectory (url, callback) {
  fs.readdir('./' + url, function (err, files) {
    if (err && err.code !== 'ENOENT') throw new Error(err)
    callback(files)
  })
}
function ensureEmpty (url, force, callback) {
  emptyDirectory(url, function (empty) {
    if (empty || force) {
      callback()
    } else {
      console.log(chalk.yellow('Destination is not empty:'), url)
    }
  })
}
function write (url, str) {
  fs.writeFile(url, str)
  console.log(chalk.cyan('   Created File:'), url)
}
function readTemplate (url, data) {
  var template = fs.readFileSync(__dirname + '/' + url, 'utf8')

  for (var index in data) {
    template = template.split('__' + index + '__').join(data[index])
  }

  return template
}
function readFile (url) {
  var template = fs.readFileSync(__dirname + '/' + url, 'utf8')
  return template
}
function mkdir (url, fn) {
  shell.mkdir('-p', url)
  shell.chmod(755, url)
  console.log(chalk.cyan('   Created Directory:'), url)
  if (fn) fn()
}

//
//
//

function buildFront (data, cb) {
  var change = {
    name: data.name,
    Name: _.capitalize(data.name)
  }
  var pathVar = './client'
  ensureEmpty(pathVar + '/modules/' + data.name + '/', false, function () {
    mkdir(pathVar + '/modules/' + data.name + '/', function () {
      readDirectory('./commands/template/client/', function (files) {
        // FILTER OUT DC STORES ...etc anythin with a .
        files = _.filter(files, function (n) {
          return !_.startsWith(n, '.')
        })
        var clientModuleJs = readFile('../client/modules/client.module.js')
        write('./client/modules/client.module.js', clientModuleJs.replace(/(\/\/ DONT REMOVE - APP GENERATOR)+/igm, ",\n 'app." + change.name + "' // DONT REMOVE - APP GENERATOR"))
        _.forEach(files, function (n) {
          if (path.extname(n) === '.html') {
            write(pathVar + '/modules/' + data.name + '/' + n, readTemplate('./template/client/' + n, change))
          } else {
            write(pathVar + '/modules/' + data.name + '/' + data.name + '.' + n, readTemplate('./template/client/' + n, change))
          }
        })
      })
    })
  })
}
function buildBack (data, cb) {
  console.log('build', data.name)
  console.log('build', data.schema)
  var change = {
    name: data.name,
    Name: _.capitalize(data.name)
  }
  var pathVar = './server'
  ensureEmpty(pathVar + '/modules/' + data.name + '/', false, function () {
    mkdir(pathVar + '/modules/' + data.name + '/', function () {
      readDirectory('./commands/template/server/', function (files) {
        // FILTER OUT DC STORES ...etc anythin with a .
        files = _.filter(files, function (n) {
          return !_.startsWith(n, '.')
        })
        _.forEach(files, function (n) {
          console.log(n)

          write(pathVar + '/modules/' + data.name + '/' + data.name + '.' + n, readTemplate('./template/server/' + n, change))
        })
      })
    })
  })
}
var introQuestions = [
  {
    type: 'list',
    name: 'intro',
    message: 'What do you want to do?',
    choices: [
      new inquirer.Separator('Module Creation:'),
      'Create Frontend Module',
      'Create Backend Module',
      'Create Frontend & Backend Module',
      new inquirer.Separator('User Management:'),
      'Create User',
      'Change Password',
      'Change User Roles',
      'View User'
    ]
  }
]
var rolesQuestions = [
  {
    type: 'list',
    name: 'role',
    message: 'What do you want to do with user roles?',
    choices: [
      'Add Role',
      'Remove Role'
    ]
  }
]
var userQuestions = [
  {
    type: 'input',
    name: 'email',
    message: 'Email of the User',
    default: function () { return 'test@test.com' }
  }
]
var moduleQuestions = [
  {
    type: 'input',
    name: 'module',
    message: 'Name of the Module',
    default: function () { return 'example' }
  }
]
var schemaOutput = []

var schemaQuestions = [
  {
    type: 'input',
    name: 'field',
    message: 'Name of the field',
    default: function () { return 'Example' }
  },
  {
    type: 'list',
    name: 'type',
    message: "What's the type",
    choices: [
      'String',
      'Number',
      'Date',
      'Buffer',
      'Boolean',
      'Mixed',
      'Objectid',
      'Array'
    ],
    default: function () { return 'String' }
  },
  {
    type: 'input',
    name: 'default',
    message: "What's the default value(just hit enter for NULL)",
    default: function () { return null }
  },
  {
    type: 'confirm',
    name: 'askAgain',
    message: 'Want to add another field (just hit enter for YES)?',
    default: true
  }
]

function buildSchema (cb) {
  inquirer.prompt(schemaQuestions, function (answers) {
    schemaOutput.push(answers)
    if (answers.askAgain) {
      buildSchema(cb)
    } else {
      var schema = {}
      _.forEach(schemaOutput, function (n) {
        schema[_.camelCase(n.field)] = {
          field: _.camelCase(n.field),
          type: n.type,
          default: n.default
        }
      })
      cb(schema)
      schemaOutput = []
    }
  })
}

function buildModule (front, back, cb) {
  inquirer.prompt(moduleQuestions, function (answers) {
    try {
      if (front && !back) {
        buildFront({
          name: answers.module
        }, function (err) {
          cb(err)
        })
      } else if (back && !front) {
        buildSchema(function (data) {
          buildBack({
            name: answers.module,
            schema: data
          }, function (err) {
            if (err)console.log(err)
            cb({
              name: answers.module,
              schema: data
            })
          })
        })
      } else if (back && front) {
        buildSchema(function (data) {
          buildFront({
            name: answers.module
          }, function (err) {
            if (err)console.log(err)
          })
          buildBack({
            name: answers.module,
            schema: data
          }, function (err) {
            if (err)console.log(err)
            cb(err)
          })
        })
      }
    } catch (err) {
      console.log(err)
    } finally {
      cb(answers)
    }
  })
}
function findUser (cb) {
  inquirer.prompt(userQuestions, function (answers) {
    User.findOne({ email: answers.email }, function (err, existingUser) {
      cb(err, existingUser)
    })
  })
}
var updatePasswords = [
  {
    type: 'password',
    name: 'password',
    message: 'New Password of the User'
  }
]
function updateUser (answers, cb) {
  User.findOne({ email: answers.email }, function (err, user) {
    if (err) {
      cb(err, null)
    }
    user = _.merge(user, answers.user)
    user.save(function (err) {
      if (err) {
        cb(err, null)
      }
      cb(null, user)
    })
  })
}
function updatePassword (user, cb) {
  inquirer.prompt(updatePasswords, function (answers) {
    updateUser({
      email: user.email,
      user: {
        password: answers.password
      }
    }, function (err, data) {
      if (err) {
        console.log(chalk.red(err))
      }
      cb(err, data)
    })
  })
}

var updateRoles = [
  {
    type: 'input',
    name: 'role',
    message: 'Name of the Role'
  }
]
function addRoles (user, cb) {
  inquirer.prompt(updateRoles, function (answers) {
    user.roles.push(answers.role)
    user.roles = _.uniq(user.roles)
    updateUser({
      email: user.email,
      user: {
        roles: user.roles
      }
    }, function (err, data) {
      if (err) {
        console.log(chalk.red(err))
      }
      cb(err, data)
    })
  })
}
function removeRoles (user, cb) {
  inquirer.prompt(updateRoles, function (answers) {
    user.roles = _.remove(user.roles, answers.role)
    updateUser({
      email: user.email,
      user: {
        roles: user.roles
      }
    }, function (err, data) {
      if (err) {
        console.log(chalk.red(err))
      }
      cb(err, data)
    })
  })
}
function ask () {
  inquirer.prompt(introQuestions, function (answers) {
    switch (answers.intro) {
      case 'Create Frontend Module':
        buildModule(true, false, function (data) {
          // console.log(_.capitalize(data), ':ModuleName')
        })
        break
      case 'Create Backend Module':
        buildModule(false, true, function (data) {
          // console.log(_.capitalize(data.module), ':ModuleName')
        })
        break
      case 'Create Frontend & Backend Module':
        buildModule(true, true, function (data) {
          // console.log(_.capitalize(data.module), ':ModuleName')
        })
        break
      case 'Create User':
        findUser(function (err, data) {
          if (err) {
            console.log(chalk.red(err))
          } else {
            if (data === null) {
              console.log(chalk.red('No User Found Under That Email'))
            } else {
              console.log(chalk.green(data))
            }
          }
        })
        break
      case 'Change Password':
        findUser(function (err, user) {
          if (err) {
            console.log(chalk.red(err))
          } else {
            if (user === null) {
              console.log(chalk.red('No User Found Under That Email'))
            } else {
              updatePassword(user, function (err, data) {
                if (err) {
                  console.log(chalk.red(err))
                } else {
                  if (data === null) {
                    console.log(chalk.red('No User Found Under That Email'))
                  } else {
                    console.log(chalk.green(data))
                  }
                }
              })
            }
          }
        })

        break
      case 'Change User Roles':
        findUser(function (err, user) {
          if (err) {
            console.log(chalk.red(err))
          } else {
            if (user === null) {
              console.log(chalk.red('No User Found Under That Email'))
            } else {
              inquirer.prompt(rolesQuestions, function (answers) {
                if (answers.role === 'Add Role') {
                  addRoles(user, function (err, data) {
                    if (err) {
                      console.log(chalk.red(err))
                    } else {
                      if (data === null) {
                        console.log(chalk.red('No User Found Under That Email'))
                      } else {
                        console.log(chalk.green(data))
                      }
                    }
                  })
                } else {
                  removeRoles(user, function (err, data) {
                    if (err) {
                      console.log(chalk.red(err))
                    } else {
                      if (data === null) {
                        console.log(chalk.red('No User Found Under That Email'))
                      } else {
                        console.log(chalk.green(data))
                      }
                    }
                  })
                }
              })
            }
          }
        })

        break
      case 'View User':
        findUser(function (err, user) {
          if (err) {
            console.log(chalk.red(err))
          } else {
            if (user === null) {
              console.log(chalk.red('No User Found Under That Email'))
            } else {
              console.log(chalk.green(user))
            }
          }
        })
        break
    }
  })
}

ask()
