import { User } from "../../models/userModel/users.model.js";
import { sequelize } from "../../../databases.js";
import { Config } from "../../config/config.js";
import  Jwt  from "jsonwebtoken";
import nodemailer from 'nodemailer'
import bcrypt from "bcrypt"
import { config } from "dotenv";

export const loginUser = async (req,res) => {
try {
    await sequelize.sync()
    const { email, password } = req.body;
    const user = await User.findOne({
        where: {
          email: email,
        },
      });
    const decryptedPassword = await bcrypt.compare(password, user.password);
    if(decryptedPassword) {
        const accessToken = Jwt.sign({
            fullName: user.fullName,
            email: user.email,
            isAdmin: user.isAdmin
        },Config.JwtPass,{expiresIn: '12hr'})
        res.status(200).json({
            status: 'success',
            data: user.email,
            token: accessToken
        })
    }else {
        res.status(400).json({
            status: 'failed',
            message: 'incorrect info'
        })
    }
} catch (error) {
    res.status(400).json({
        status: 'failed',
        data: error
    })
}}

const verifyToken = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(authHeader) {
        const token = authHeader.split(' ')[1]
        Jwt.verify(token,Config.JwtPass,(err,data) => {
            if(err) res.status(403).json({status: 'failed',data: err});
            req.user = data;
            next()
        })
    }else {
        res.status(403).json({
            status: 'failed',
            message: 'unauthorised user'
        })
    }
}


export const verifyTokenAndUser = (req,res,next) => {
    verifyToken(req,res,() => {
    if(req.user.id == req.params.id || req.user.isAdmin) {
        next()
    }else {
        res.status(403).json({
       status: 'failed',
       message: 'not an admin'
        })
    }
    })
}



export const verifyTokenAndAdmin = (req,res,next) => {
    verifyToken(req,res,() => {
      if(req.user.isAdmin) {
        next()
      }else {
        res.status(403).json({
          status: 'failed',
          message: "not an admin"
        })
      }
    })
    }

export const forgotPassword =  async(req,res,next) => {
    try {
        await sequelize.sync()
        const { email } = req.body;
    const user = await User.findOne({
        where: {
            email: email
        }
    })
    if(user) {
        const secret = Config.JwtPass;
        const payload = {
            email: user.email,
            id: user.id
        }

        const token = Jwt.sign(payload,secret,{expiresIn: '15m'})

        const link = `http://localhost:8080/api/v1/auth/reset-password/${user.id}/${token}`
        let mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "tech2dom@gmail.com",
                pass: "jjqwywcbxaepqsoc"
            }
        })

        let details = {
            from: "tech2dom@gmail.com",
            to: email,
            subject: "test account",
            html: `
            <div style='
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 300px;
            width: 400px
            '>
            <h1 style='color: blue; font-size= 30px'>Reset Password</h1>
        <a href=${link} style='
        text-decoration: none;
        '><button style='
           width: 170px;
           height: 50px;
           border-radius: 10px;
           border: none;
        '>
           click on link to reset password
        </button></a>
            </div>
            `
        }

        mailTransporter.sendMail(details,(err) => {
            if(err) {
                res.status(400).json({
                    status: 'failed',
                    message: 'email not sent',
                    data: err
                })
            }else {
                res.status(201).json({
                    status: 'success',
                    message: 'email sent'
                })
            }
        })
        console.log(link)
    }else {
        res.status(400).json({
            status: 'failed',
            message: 'user not found'
        })  
    }
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            data: error
        })
    }
}

export const getResetPassword = async (req,res,next) => {
try {
    const {id,token} = req.params;
    const user = await User.findOne({
        where: {
            id: id
        }
    })
    console.log(token)
    if(id == user.id) {
      const secret = config.JwtPass;
        Jwt.verify(token,secret,(err,data) => {
            console.log(data)
        })
      res.render('reset-password',{email: user.email});
    }else {
        res.status(400).json({
            status: 'failed',
            data: 'incorrect identifier'
        })
    }
} catch (error) {
    res.status(400).json({
        status: 'failed',
        data: error
    })
}}

export const postResetPassword = async(req,res) => {
    try {
        await sequelize.sync()
        const {id,token} = req.params;
        const {password,confirmPassword} = req.body;

        console.log(password,confirmPassword)
        const user = await User.findOne({
            where: {
                id: id
            }
        })

        if(user) {
            const secret = Config.JwtPass;
          const payload = Jwt.verify(token,secret)

             res.status(200).json({
                status: 'success',
                data: {
                    password,
                    confirmPassword
                }
             })

        }
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            data: error
        })
    }
}

//alimisam_new-promise-db
//new_promise
//promise@new