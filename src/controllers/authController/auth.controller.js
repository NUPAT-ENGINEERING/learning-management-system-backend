import { User } from "../../models/userModel/users.model.js";
import { sequelize } from "../../../databases.js";
import { Config } from "../../config/config.js";
import  Jwt  from "jsonwebtoken";
import { sendMail } from "../../utils/sendmail.js";
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
        },Config.JwtPass,{expiresIn: '12hrs'})
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

        sendMail(email,link)

        res.status(200).send('password reset link sent to your email')
       
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
   
    if(id == user.id) {
      const secret = config.JwtPass;
    //  const payload = Jwt.verify(token,secret)
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
        const {id} = req.params;
        const {password} = req.body;
      console.log(password)
        User.update({
            password: 'hello'
        },{
            where: id,
        })
        
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            data: error
        })
    }
}