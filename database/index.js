const dbconfig = require("./connectionURI")
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
const db = {}

db.mongoose = mongoose
db.url = dbconfig.DB_URI
db.users = require("./models/User")
db.userType = require('./models/UserType')
db.plats = require('./models/Plat')

module.exports = db