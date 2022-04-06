const express = require("express")
const { default: mongoose } = require("mongoose")
const Restaurant = require("../database/models/Restaurant")
var bodyParser = require("body-parser").json()
const router = express.Router()
const auth = require("../middlewares/auth")


router.post('/restaurant', auth, bodyParser, async (req, res) => {
    const { name, description, address } = req.body
    try {
        if (!name || !description || !address) {
            res.status(400).send({ message: "Some fields are required" })
            return
        }
        Restaurant.findOne({ name: new RegExp('^' + name + '$', "i") }, (err, rest) => {
            if (err) {
                res.status(400).send({ message:"Error on the server " })
                return
            }
            if (rest) {
                res.status(400).send({message: "The name of this restaurant already exist in the database"})
                return
            } else {
                const rest_temp = new Restaurant({
                    name: name,
                    description: description,
                    address: address
                })
                rest_temp.save()
                return res.status(200).json({ message: "saved successfully", restaurant: rest_temp })
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
        return 
    }
})

router.get('/restaurant', async (req, res) => {
    try {
        Restaurant.find({}).exec((err, transaction) => {
            if (err) {
                res.status(400).send({ message:"Error on the server " })
                return
            }
            res.status(200).json({ restaurant: transaction })
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
        return 
    }
})

module.exports = router