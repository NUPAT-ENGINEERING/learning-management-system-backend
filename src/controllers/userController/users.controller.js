import { sequelize } from "../../../databases.js";
import { User } from "../../models/userModel/users.model.js";
import bcrypt from 'bcrypt';

export const registerUser = async (req,res) => {
    try {
        await sequelize.sync()
const {firstName,lastName,email,phoneNumber,password} = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);  
        
      if(hashedPassword) {
        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            password: hashedPassword
        })
        res.status(201).json({
            status: "success",
            data: user,
          });
      }
    } catch (error) {
        res.status(400).json({
            status: 'error',
            data: error
        })
    }
}

export const deleteUserById = async (req,res) => {
    try {
        await sequelize.sync()
        const user = await User.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({
            status: 'success',
            data: null
        })
    } catch (error) {
        res.status(400).json({
            status: "failed",
            data: error
        })
    }
}

export const updateUserById = async (req,res) => {
    try {
        await sequelize.sync()
        const {firstName,surname,email,phoneNumber} = req.body;
    const user = User.update({
        firstName: firstName,
        surname: surname,
        email: email,
        phoneNumber: phoneNumber
    },{
        where: {
            id: req.params.id
        }
    })
} catch (error) {
    res.status(400).json({
        status:"failed",
         data: error
    })
}
}

export const getAllUser = async(req,res) => {
    try {
        await sequelize.sync();
        const user = await User.findAll()
        res.status(200).json({
            status: "success",
            data: user
        })
    } catch (error) {
        res.status(400).json({
            status: "failed",
            data: error
        })
    }
}