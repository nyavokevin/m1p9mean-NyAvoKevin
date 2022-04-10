
const express = require("express")
var bodyParser = require('body-parser').json()
const User = require('../database/models/User')
const jwt = require("jsonwebtoken")
const router = express.Router()
const auth = require("../middlewares/auth")
const admin = require("../middlewares/admin")
const nodemailer = require("nodemailer");

//register user 
router.post("/register", bodyParser, async (req, res) => {
    const { fullname, login, password, role,email} = req.body
    try {
        if (!role) {
            res.status(400).send({ message: "Give a role to the new user" })
            return
        }
        if (!fullname && login && password) {
            res.status(400).send({ message: "All fields should not empty" })
            return
        }
        User.findOne({ login: new RegExp('^' + login + '$', "i")}, (err, user) => {
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
                    email: email,
                    login: login,
                    password: password,
                    role: role
                })
                user_temp.save()
                const token = jwt.sign({
                    user_id: user_temp._id,login,role
                }, "secretkeytop",
                {
                    expiresIn: "2h"   
                    })
                testmain(email)
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
                            user_id: user._id,
                            login
                        }, "secretkeytop",
                        {
                            expiresIn: "2h"   
                            })
                        user.token = token
                        console.log(user)
                        res.status(200).json({ message: "User connected", user: user  })
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

router.get('/users/restaurant/:id', auth, admin, async (req, res) => {
    const restaurant_id = req.params.id
    try {
        const users = await User.find({ 'restaurant_personel': restaurant_id }).populate("role",{"type":1})
        res.status(200).json({ users: users })
    } catch (error) {
        res.status(500).json(error)
    }
})

router.post('/user/information', bodyParser, async (req, res) => {
    const { user_id, fullname, email } = req.body
    try {
        User.findOneAndUpdate({ _id: mongoose.mongo.ObjectId(user_id) },
            {
                $set: {
                    fullname: fullname,
                    email: email
                }
            }
            , (err, user) => {
                if (err) {
                    res.status(500).json(err)
                }
                res.status(200).send({ message: updated })
        })
    } catch (error) {
        res.status(500).json(error)
        return
    }
})

router.get('/user/test', async (req, res) => {
    await testmain()
})

async function testmain(email){
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "26a68ecf0c8dc0", // generated ethereal user
            pass: "aa894818228d7d", // generated ethereal password
        }
    });
    
    let info = await transporter.sendMail({
    from: '"E-kaly Administrator 👻" <e-kaly@admin.com>', // sender address
    to: email, // list of receivers
    subject: "Welcome to e-kaly", // Subject line
    text: "Welcome to e-kaly", // plain text body
    html: `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Simple Transactional Email</title>
    <style>
      /* -------------------------------------
          GLOBAL RESETS
      ------------------------------------- */
      
      /*All the styling goes here*/
      
      img {
        border: none;
        -ms-interpolation-mode: bicubic;
        max-width: 100%; 
      }

      body {
        background-color: #f6f6f6;
        font-family: sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 14px;
        line-height: 1.4;
        margin: 0;
        padding: 0;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%; 
      }

      table {
        border-collapse: separate;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        width: 100%; }
        table td {
          font-family: sans-serif;
          font-size: 14px;
          vertical-align: top; 
      }

      /* -------------------------------------
          BODY & CONTAINER
      ------------------------------------- */

      .body {
        background-color: #f6f6f6;
        width: 100%; 
      }

      /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
      .container {
        display: block;
        margin: 0 auto !important;
        /* makes it centered */
        max-width: 580px;
        padding: 10px;
        width: 580px; 
      }

      /* This should also be a block element, so that it will fill 100% of the .container */
      .content {
        box-sizing: border-box;
        display: block;
        margin: 0 auto;
        max-width: 580px;
        padding: 10px; 
      }

      /* -------------------------------------
          HEADER, FOOTER, MAIN
      ------------------------------------- */
      .main {
        background: #ffffff;
        border-radius: 3px;
        width: 100%; 
      }

      .wrapper {
        box-sizing: border-box;
        padding: 20px; 
      }

      .content-block {
        padding-bottom: 10px;
        padding-top: 10px;
      }

      .footer {
        clear: both;
        margin-top: 10px;
        text-align: center;
        width: 100%; 
      }
        .footer td,
        .footer p,
        .footer span,
        .footer a {
          color: #999999;
          font-size: 12px;
          text-align: center; 
      }

      /* -------------------------------------
          TYPOGRAPHY
      ------------------------------------- */
      h1,
      h2,
      h3,
      h4 {
        color: #000000;
        font-family: sans-serif;
        font-weight: 400;
        line-height: 1.4;
        margin: 0;
        margin-bottom: 30px; 
      }

      h1 {
        font-size: 35px;
        font-weight: 300;
        text-align: center;
        text-transform: capitalize; 
      }

      p,
      ul,
      ol {
        font-family: sans-serif;
        font-size: 14px;
        font-weight: normal;
        margin: 0;
        margin-bottom: 15px; 
      }
        p li,
        ul li,
        ol li {
          list-style-position: inside;
          margin-left: 5px; 
      }

      a {
        color: #3498db;
        text-decoration: underline; 
      }

      /* -------------------------------------
          BUTTONS
      ------------------------------------- */
      .btn {
        box-sizing: border-box;
        width: 100%; }
        .btn > tbody > tr > td {
          padding-bottom: 15px; }
        .btn table {
          width: auto; 
      }
        .btn table td {
          background-color: #ffffff;
          border-radius: 5px;
          text-align: center; 
      }
        .btn a {
          background-color: #ffffff;
          border: solid 1px #3498db;
          border-radius: 5px;
          box-sizing: border-box;
          color: #3498db;
          cursor: pointer;
          display: inline-block;
          font-size: 14px;
          font-weight: bold;
          margin: 0;
          padding: 12px 25px;
          text-decoration: none;
          text-transform: capitalize; 
      }

      .btn-primary table td {
        background-color: #3498db; 
      }

      .btn-primary a {
        background-color: #3498db;
        border-color: #3498db;
        color: #ffffff; 
      }

      /* -------------------------------------
          OTHER STYLES THAT MIGHT BE USEFUL
      ------------------------------------- */
      .last {
        margin-bottom: 0; 
      }

      .first {
        margin-top: 0; 
      }

      .align-center {
        text-align: center; 
      }

      .align-right {
        text-align: right; 
      }

      .align-left {
        text-align: left; 
      }

      .clear {
        clear: both; 
      }

      .mt0 {
        margin-top: 0; 
      }

      .mb0 {
        margin-bottom: 0; 
      }

      .preheader {
        color: transparent;
        display: none;
        height: 0;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
        mso-hide: all;
        visibility: hidden;
        width: 0; 
      }

      .powered-by a {
        text-decoration: none; 
      }

      hr {
        border: 0;
        border-bottom: 1px solid #f6f6f6;
        margin: 20px 0; 
      }

      /* -------------------------------------
          RESPONSIVE AND MOBILE FRIENDLY STYLES
      ------------------------------------- */
      @media only screen and (max-width: 620px) {
        table.body h1 {
          font-size: 28px !important;
          margin-bottom: 10px !important; 
        }
        table.body p,
        table.body ul,
        table.body ol,
        table.body td,
        table.body span,
        table.body a {
          font-size: 16px !important; 
        }
        table.body .wrapper,
        table.body .article {
          padding: 10px !important; 
        }
        table.body .content {
          padding: 0 !important; 
        }
        table.body .container {
          padding: 0 !important;
          width: 100% !important; 
        }
        table.body .main {
          border-left-width: 0 !important;
          border-radius: 0 !important;
          border-right-width: 0 !important; 
        }
        table.body .btn table {
          width: 100% !important; 
        }
        table.body .btn a {
          width: 100% !important; 
        }
        table.body .img-responsive {
          height: auto !important;
          max-width: 100% !important;
          width: auto !important; 
        }
      }

      /* -------------------------------------
          PRESERVE THESE STYLES IN THE HEAD
      ------------------------------------- */
      @media all {
        .ExternalClass {
          width: 100%; 
        }
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%; 
        }
        .apple-link a {
          color: inherit !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          text-decoration: none !important; 
        }
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
        .btn-primary table td:hover {
          background-color: #34495e !important; 
        }
        .btn-primary a:hover {
          background-color: #34495e !important;
          border-color: #34495e !important; 
        } 
      }

    </style>
  </head>
  <body>
    <span class="preheader">This is preheader text. Some clients will show this text as a preview.</span>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
      <tr>
        <td>&nbsp;</td>
        <td class="container">
          <div class="content">

            <!-- START CENTERED WHITE CONTAINER -->
            <table role="presentation" class="main">

              <!-- START MAIN CONTENT AREA -->
              <tr>
                <td class="wrapper">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p>Hi there,</p>
                        <p>You just join e-kaly.</p>
                        <p>Good luck!.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            <!-- END MAIN CONTENT AREA -->
            </table>
            <!-- END CENTERED WHITE CONTAINER -->
          </div>
        </td>
        <td>&nbsp;</td>
      </tr>
    </table>
  </body>
</html>`
  });
}

module.exports = router;