const dbconfig = require("./connectionURI")
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
const db = {}

db.mongoose = mongoose
db.url = dbconfig.DB_URI
db.users = require("./models/User")
db.userType = require('./models/UserType')
db.plats = require('./models/Plat')
db.command = require('./models/Command')
db.restaurants = require('./models/Restaurant')

module.exports = db