import { User } from "../../models/userModel/users.model.js";
import { sequelize } from "../../../databases.js";
import { Config } from "../../config/config.js";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"

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
            email: user.email
        },Config.JwtPass,{expiresIn: '12hrs'})

        res.status(200).json({
            status: 'success',
            data: user.email,
            token: accessToken
        })
    }
} catch (error) {
    res.status(400).json({
        status: 'failed',
        data: error
    })
}}

export const getForgortPassword = (req,res,next) => {
    res.render('forgot-password')
}