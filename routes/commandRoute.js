const express = require("express")
const { default: mongoose } = require("mongoose")
var bodyParser = require("body-parser").json()
const Command = require("../database/models/Command")
const auth = require("../middlewares/auth")

const router  = express.Router()

router.post('/command',auth,bodyParser, async(req,res)=>{
    const { listPlat, client_id } = req.body
    try{
        if(!listPlat){
            res.status(400).send({ message: "List of dishes is empty" })
            return
        }
        const user = req.user
        const array_temp = []
        listPlat.forEach(element => {
            var newId = new mongoose.mongo.ObjectId(element);
            array_temp.push(newId)
        });
        
        const command_temp = new Command({
            client: client_id,
            created_by : user.user_id,
            plats: array_temp
        })
        command_temp.save()
        return res.status(200).send({ message: "insert successfuly" })
       
    }catch(err){
        return res.status(500).json(err)
    }
})

router.get('/command',auth,async(req, res)=>{
    try{
        const command  = await Command.find({})
            .populate({ path: 'client', select: 'fullname' })
            .populate({ path: 'plats', select: ['name','price'] })
            .exec()
        res.status(200).json({ command: command })
    }catch(err){
        return res.status(500).json(err)
    }
})

module.exports = router