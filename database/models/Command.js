const { mongoose } = require('mongoose')
require('mongoose-double')(mongoose);

const schema = new mongoose.Schema({
    client: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
    plats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "plats"
        }
    ],
    livreur: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
    created_by:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
}, { timestamps: {} })

schema.method("toJSON", function () {
    const { _v, _id, ...object } = this.toObject()
    object.id = _id
    return object
})

const Command = mongoose.model("command", schema)
module.exports = Command