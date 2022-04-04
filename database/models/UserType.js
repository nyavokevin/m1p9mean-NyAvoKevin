const { mongoose } = require('mongoose')
// ----------------- User model utilisant mongoose
const schema = new mongoose.Schema({
    type: {
        type: String,
        require: true,
        max: [100, "Max length"]
    }
}, { timestamps: {} } )


// override la method toJSON pour que _v, _id return un string ( pour le front end )
schema.method("toJSON", function () {
    const { _v, _id, ...object } = this.toObject()
    object.id = _id
    return object
})
const UserType = mongoose.model("userType", schema)
module.exports = UserType
