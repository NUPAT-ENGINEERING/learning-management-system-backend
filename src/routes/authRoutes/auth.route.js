import { Router } from "express";
import { getForgortPassword, loginUser } from "../../controllers/authController/auth.controller.js";

export const authRoute = Router();
authRoute.route('/login').post(loginUser)
authRoute.route('/forgot-password').get(getForgortPassword).post()
authRoute.route('/reset-password').get().post()