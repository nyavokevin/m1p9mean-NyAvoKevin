const { mongoose } = require('mongoose')
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;
const schema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    address: {
        type:String,
        require: true
    },
    utilisateurs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }
    ]
}, { timestamps: {} })

schema.method("toJSON", function () {
    const { _v, _id, ...object } = this.toObject()
    object.id = _id
    return object
})

const Restaurant = mongoose.model("restaurants", schema)
module.exports = Restaurant