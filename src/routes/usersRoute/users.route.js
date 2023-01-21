import { Router } from "express";
import { deleteUserById, registerUser } from "../../controllers/userController/users.controller.js";

export const userRouter = Router();

userRouter.route('/register').post(registerUser)
userRouter.route('/:id').delete(deleteUserById)