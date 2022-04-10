const User = require("../database/models/User")
const { mongoose } = require('mongoose')
require('mongoose-double')(mongoose);
const verifyAdmin = async (req, res, next) => {
    try {
        User.find({ _id: mongoose.Types.ObjectId(req.user.user_id) }).populate("role").then(user => {
            if (user[0].role[0].type != "Administrator") {
                return res.status(403).send("You are not allowed to use this ressource");
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(401).send("Invalid User");
    }

    return next();
}

module.exports = verifyAdmin