const { mongoose } = require('mongoose')
require('mongoose-double')(mongoose);
autoIncrement = require('mongoose-auto-increment');

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
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "restaurants"
    },
    image_url: {
        type: String,
        require: false
    }
}, { timestamps: {} })

autoIncrement.initialize(mongoose.connection)
schema.plugin(autoIncrement.plugin, {
  model: 'plats',
  field: 'plat_id',
  startAt: 1,
  incrementBy: 1
});
schema.method("toJSON", function () { 
    const { _v, _id, ...object } = this.toObject()
    object.id = _id
    return object
})


const Plat = mongoose.model("plats", schema)
module.exports = Plat