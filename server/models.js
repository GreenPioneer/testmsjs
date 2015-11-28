var path = require('path')
var async = require('async')
var _ = require('lodash')
var fs = require('fs')
var chalk = require('chalk')
var lookDir = path.resolve(__dirname, './modules')
var configs = []
if (!fs.existsSync(lookDir)) {
  console.log('does not existsSync')
}
var data = {}
var exporting = {}
var modules = fs.readdirSync(lookDir)

modules = _.filter(modules, function (n) {
  return !_.startsWith(n, '.')
})
data.modules = modules
_.forEach(data.modules, function (value, key) {
  var obj = {
    'name': value,
    'lookup': lookDir + '/' + value
  }
  var files = fs.readdirSync(lookDir + '/' + value)

  files = _.filter(files, function (n) {
    return !_.startsWith(n, '.')
  })
  obj.files = []
  _.forEach(files, function (f) {
    var fileData = _.words(f, /[^. ]+/g)
    obj.files.push({
      'type': fileData[1],
      'ext': fileData[2],
      'name': fileData[0],
      'orginal': f
    })
  // configs[value].push(f)
  })
  configs.push(obj)
})
// _.forEach(configs, function (r) {
//   // console.log('./modules/' + r.name + '/' + r.files[0].orginal)
//   var req = require('./modules/' + r.name + '/' + r.files[0].orginal)
//   // console.log(req)
//   _.forEach(req, function (f, key) {
//     // console.log(f, key)
//     exporting[key] = f
//   // module.exports[key] = f
//   })
// // module.exports[r.name] = require(req)
// })

function Register (app) {
  this.configs = configs
  this.app = app
}
Register.prototype.all = function () {
  function setup () {
    return {
      configs: this.configs,
      app: this.app
    }
  }
  // return functions.query(setup.bind(this))
  return all(setup.bind(this))

}
function all (setup) {
  var settings = setup()
  _.forEach(settings.configs, function (r) {
    var files = {'models': [],'controllers': []}
    _.forEach(r.files, function (j) {
      if (j.type === 'controller') {
        // files.controllers.push(require('./modules/' + r.name + '/' + j.orginal))
      }
      else if (j.type === 'model') {
        files.models.push(require('./modules/' + r.name + '/' + j.orginal))
      }
      else if (j.type === 'routes') {
        // files.models.push(require('./modules/' + r.name + '/' + j.orginal))
        // console.log(systemModel)
        // console.log(settings)
        settings.app.use('/system/', require('./modules/' + r.name + '/' + j.orginal))
      }
    })
  // console.log(files)
  // _.forEach(req, function (f, key) {
  //   exporting[key] = f
  // // module.exports[key] = f
  // })
  })
}
function register (options) {
  if (options === undefined) {
    return new Register()
  } else {
    return new Register(options)
  }

// if (typeof options === 'object' && options !== null) {
//   return new Register(options)
// }
// throw new TypeError(chalk.red('Expected object for argument options but got ' + chalk.red.underline.bold(options)))
}
module.exports = register
// async.waterfall([
//   function (callback) {
//     fs.readdir(lookDir, function (err, modules) {
//       if (err) {
//         console.log(err)
//       } else {
//         modules = _.filter(modules, function (n) {
//           return !_.startsWith(n, '.')
//         })
//         callback(null, modules)
//       }
//     })
//   },
//   function (modules, callback) {
//     async.forEachOf(modules, function (value, key, callbackForEach) {
//       var obj = {
//         'name': value,
//         'lookup': lookDir + '/' + value
//       }
//       fs.readdir(lookDir + '/' + value, function (err, files) {
//         files = _.filter(files, function (n) {
//           return !_.startsWith(n, '.')
//         })
//         obj.files = []
//         _.forEach(files, function (f) {
//           var fileData = _.words(f, /[^. ]+/g)
//           obj.files.push({
//             'type': fileData[1],
//             'ext': fileData[2],
//             'name': fileData[0],
//             'orginal': f
//           })
//         // configs[value].push(f)
//         })
//         configs.push(obj)
//         if (err) return callbackForEach(err)
//         callbackForEach()
//       })
//     }, function (err) {
//       if (err) console.error(err.message)
//       callback(null, configs)
//     })
//   }
// ], function (err, result) {
//   // module.exports = settings
//   var obj = {}
//   _.forEach(result, function (r) {
//     // console.log('./modules/' + r.name + '/' + r.files[0].orginal)
//     var req = require('./modules/' + r.name + '/' + r.files[0].orginal)
//     // console.log(req)
//     _.forEach(req, function (f, key) {
//       // console.log(f, key)
//       obj[key] = f
//     })
//   // module.exports[r.name] = require(req)
//   })
//   console.log(obj)

// })
