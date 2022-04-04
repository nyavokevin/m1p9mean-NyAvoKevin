const express = require("express")
const { default: mongoose } = require("mongoose")
var bodyParser = require("body-parser").json()
const UserType = require("../database/models/UserType")
const auth = require("../middlewares/auth")
const router = express.Router()

//route create
router.post('/userType', bodyParser, async (req, res) => {
    const { type } = req.body
    try {
 
        if (!type) {
            res.status(400).send({ message: "Content can not be empty" })
            return
        }

        UserType.findOne({ type: new RegExp('^' + type + '$', "i")}, (err, user) => {
            if(err) {
                res.status(400).send({ message:"Error on the server " })
                return
            }
            if (user) {
                res.status(400).send({message: "Type of user already exist in the database"})
                return
            } else {
                const user_type_temp = new UserType({
                    type: type
                })
                user_type_temp.save()
                return res.json(user_type_temp)
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
        return 
    }
})

router.get('/userType', auth,bodyParser, async (req, res) => {
    try {
        UserType.find({}).exec((err, transaction) =>    {
            if (err) console.log(err)
            res.json(transaction)
       })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
        return 
    }
})

router.put('/userType', bodyParser, async (req, res) => {
    const { user_type_id, user_type } = req.body
    try {
        if (!user_type_id) {
            res.status(400).send("id of user type is missing")
            return
        }
        UserType.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user_type_id) }, {
            "$set": {
                "type": user_type
            }
        }, (err, usert_type) => {
            if (err) res.status(500).json(err)
            res.status(200).send({ message: "done", user_type: usert_type })
        })

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
        return 
    }
})

router.delete('/userType/:id', async (req, res) => {
    const id = req.params.id
    try {
        if (!id) {
            res.status(400).send({ message: "Nothing to delete" })
            return
        }
        UserType.deleteOne({ _id: mongoose.Types.ObjectId(id) }, (err, userType) => {
            res.status(200).send({ message: "successfuly deleted" });
            return
        })
    } catch (err) {
        res.status(500).json(err)
        return
    }
})

module.exports = router