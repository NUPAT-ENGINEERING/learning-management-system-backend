import { Router } from "express";
import { loginUser,forgotPassword,getResetPassword,postResetPassword } from "../../controllers/authController/auth.controller.js"

export const authRoute = Router();
authRoute.route('/login').post(loginUser)
authRoute.route('/forgot-password').post(forgotPassword)
authRoute.route('/reset-password/:id/:token').get(getResetPassword).post(postResetPassword)
