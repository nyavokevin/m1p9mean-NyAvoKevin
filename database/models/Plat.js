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
    price: {
        type: SchemaTypes.Double,
        require: true
    },
    image_url: {
        type: String,
        require: false
    }
}, { timestamps: {} })

schema.method("toJSON", function () {
    const { _v, _id, ...object } = this.toObject()
    object.id = _id
    return object
})

const Plat = mongoose.model("plats", schema)
module.exports = Plat