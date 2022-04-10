const express = require("express")
const { default: mongoose } = require("mongoose")
var bodyParser = require("body-parser").json()
const Plat = require("../database/models/Plat")
const Restaurant = require("../database/models/Restaurant")
const router = express.Router()
const auth = require("../middlewares/auth")

//route create
router.post('/plat', auth ,bodyParser, async (req, res) => {
    const { name, description, price,restaurant_id ,image } = req.body
    try {
        if (!name || !description || !price || !restaurant_id) {
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
                // const plat_temp = new Plat({
                //     name: name,
                //     description: description,
                //     price: price,
                //     restaurant: restaurant_id
                // })
                Plat.create({
                    name: name,
                    description: description,
                    price: price,
                    restaurant: restaurant_id
                }, (error, doc) => {
                    if (error) {
                        console.log(error)
                        return
                    }
                    return res.status(200).json({ message: "saved successfully", plat: doc.toJSON() })
                })
                // plat_temp.save()
                // 
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

router.get('/plat/new', async (req, res) => {
    try {
        Plat.find({}).sort({_id: -1}).limit(6).exec((err, transaction) => {
            if (err) {
                res.status(400).send({ message:"Error on the server " })
                return
            }
            res.status(200).json({ plats: transaction})
        })
    } catch (err) {
        res.status(500).json(err)
        return
    }
})

router.get('/plat/restaurant/:id', async (req, res) => {
    const  restaurant_id  = req.params.id
    try {
        if (!restaurant_id) {
            res.status(400).send({ message: "Restaurant ID is missing" })
            return
        }
        Restaurant.findOne({ 'id': restaurant_id }, (errror, restaurant) => {
            if (errror) {
                console.log(errror)
                res.status(400).send({ message:"Error on the server " })
                return
            }
            console.log(restaurant)
            Plat.find({'restaurant':restaurant._id }).sort({_id: -1}).limit(3).exec((err, transaction) => {
                if (err) {
                    res.status(400).send({ message:"Error on the server " })
                    return
                }
                console.log(transaction)
                res.status(200).json({ plats: transaction})
            })
        })
       
    } catch (err) {
        res.status(500).json(err)
        return
    }
})

module.exports = router;