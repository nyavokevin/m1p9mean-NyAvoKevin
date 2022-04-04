const express = require("express")
const { default: mongoose } = require("mongoose")
var bodyParser = require("body-parser").json()
const Plat = require("../database/models/Plat")
const router = express.Router()
const auth = require("../middlewares/auth")

//route create
router.post('/plat', auth ,bodyParser, async (req, res) => {
    const { name, description, price ,image } = req.body
    try {
        if (!name || !description || !price) {
            res.status(400).send({ message: "Some fields are required" })
            return
        }
        Plat.findOne({ name: new RegExp('^' + name + '$', "i")}, (err, plat) => {
            if(err) {
                res.status(400).send({ message:"Error on the server " })
                return
            }
            if (plat) {
                res.status(400).send({message: "The name of this dishes already exist in the database"})
                return
            } else {
                const plat_temp = new Plat({
                    name: name,
                    description: description,
                    price: price 
                })
                plat_temp.save()
                return res.status(200).json({ message: "saved successfully", plat: plat_temp })
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
        return 
    }
})

router.get('/plat', bodyParser, async (req, res) => {
    try {
        Plat.find({}).exec((err, transaction) => {
            if (err) console.log(err)
            res.status(200).json(transaction)
       })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
        return 
    }
})

router.put('/plat/:id', bodyParser, async (req, res) => {
    const { name, description, price ,image } = req.body
    try {
        const id = req.params.id
        if (!id) {
            res.status(400).send("id of plat  is missing")
            return
        }
         if (!name || !description || !price) {
            res.status(400).send({ message: "Some fields are required" })
            return
        }
        Plat.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, {
            "$set": {
                "name": name,
                "description": description,
                "price": price,
                "image": image
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

router.delete('/plat/:id', async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            res.status(400).send({ message: "Nothing to delete" })
            return
        }
        Plat.deleteOne({ '_id': mongoose.Types.ObjectId(id) }, (err, tasks) => {
            res.status(200).send({ message: "successfuly deleted" });
        })
    } catch (err) {
        res.status(500).json(err)
        return
    }
})

module.exports = router;