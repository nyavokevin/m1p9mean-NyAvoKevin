
const express = require("express")
var bodyParser = require('body-parser').json()
const User = require('../database/models/User')
const jwt = require("jsonwebtoken")
const router = express.Router()

//register user 
router.post("/register", bodyParser, async (req, res) => {
    const { fullname, login, password, role} = req.body
    try {
        if (!role) {
            res.status(400).send({ message: "Give a role to the new user" })
            return
        }
        if (!fullname && login && password) {
            res.status(400).send({ message: "All fields should not empty" })
            return
        }
        User.findOne({ fullname: new RegExp('^' + fullname + '$', "i"), login: new RegExp('^' + login + '$', "i") }, (err, user) => {
            if(err) {
                res.status(400).send({ message:"Error on the server " })
                return
            }
            if (user) {
                res.status(400).send({message: "User already exist in the database"})
                return
            } else {
                const user_temp = new User({
                    fullname: fullname,
                    login: login,
                    password: password,
                    role: role
                })
                user_temp.save()
                const token = jwt.sign({
                    user_id: user_temp._id,login 
                }, process.env.TOKEN_KEY,
                {
                    expiresIn: "2h"   
                    })
               
                return res.status(200).json({user:user_temp,token: token})
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
        return
    }
})

//login user
router.post('/login', bodyParser, async (req, res) => {
    const { login, password } = req.body
    try {
        if (!login || !password) {
            res.status(400).json({ message: "Make sure all fields are not empty" })
            return
        }
        User.findOne({ login: new RegExp('^' + login + '$', "i") }).populate("role").exec(function (err, user) {
            if (err) {
                res.status(500).json({ message: "Error on the server" })
            } else if (!user) {
                res.status(400).json({ message: "No user with this login found" })
            } else {
                user.comparePassword(password, function(matchError, isMatch) {
                    if (matchError) {
                        throw matchError
                    } else if (!isMatch) {
                        res.status(400).json({ message: "Password incorrect" })
                    } else {
                        const token = jwt.sign({
                            user_id: user._id,login 
                        }, process.env.TOKEN_KEY,
                        {
                            expiresIn: "2h"   
                            })

                        res.status(200).json({ message: "User connected", user: user, token: token  })
                    }
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
        return
    }
})

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}).populate("role",{"type":1})
        res.status(200).json({ users: users })
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;