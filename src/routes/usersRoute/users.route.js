import { Router } from "express";
import { verifyTokenAndAdmin, verifyTokenAndUser } from "../../controllers/authController/auth.controller.js";
import { deleteUserById, getAllUser, registerUser, updateUserById } from "../../controllers/userController/users.controller.js";

export const userRouter = Router();

userRouter.route('/register').post(registerUser)
userRouter.route('/:id').delete(verifyTokenAndUser,deleteUserById).put(verifyTokenAndUser,updateUserById)
userRouter.route('/').get(verifyTokenAndAdmin,getAllUser)