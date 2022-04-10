const { mongoose } = require('mongoose')
require('mongoose-double')(mongoose);

autoIncrement = require('mongoose-auto-increment');

var SchemaTypes = mongoose.Schema.Types;
const schema = new mongoose.Schema({
    id: { type: Number, unique: true, min: 1 },
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


autoIncrement.initialize(mongoose.connection)
schema.plugin(autoIncrement.plugin, {
  model: 'restaurants',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});

schema.method("toJSON", function () {
    const { _v, _id, ...object } = this.toObject()
    return object
})

const Restaurant = mongoose.model("restaurants", schema)
module.exports = Restaurant