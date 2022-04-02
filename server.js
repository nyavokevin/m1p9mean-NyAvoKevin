require("dotenv").config({path: __dirname + '/.env'})
const express = require('express')
const cors = require('cors')


const app = express()
app.use(express.json())

//configure cors :
app.use(
    cors({ 
        origin: "*", 
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: [
            'Content-Type', 
            'Authorization', 
            'Origin', 
            'x-access-token', 
            'XSRF-TOKEN'
        ], 
        preflightContinue: false 
    })
);

//import route
const userRouter = require("./routes/userRoute")
const userTypeRouter = require("./routes/userTypeRoute")
const platRouter = require("./routes/platRoute")
app.use("/api",userRouter)
app.use("/api",userTypeRouter)
app.use("/api",platRouter)
app.get('/', async (req, res) => {
    console.log("test get")
})

console.log(process.env.TOKEN_KEY)

//use mongoose
const db = require("./database/index")
//connection db
db.mongoose
    .connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log("database connected")
    })
    .catch(err => {
        console.log(err)
        process.exit()
    })

app.listen({ port: process.env.PORT || 5000 }, async () => {
    console.log("server up")
})