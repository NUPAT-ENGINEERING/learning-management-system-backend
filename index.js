import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import dotenv from 'dotenv';
import { userRouter } from './src/routes/usersRoute/users.route.js';
import { authRoute } from './src/routes/authRoutes/auth.route.js';
import swaggerUi from 'swagger-ui-express';
import SwaggerDocument from './swagger.json' assert { type: "json" }
export const App = express();
dotenv.config({ path: "./config.env" })



App.use(cors())
App.use(helmet())
App.use(express.json())
App.set('view engine', 'ejs')
App.use('/api/v1/api-docs',swaggerUi.serve,swaggerUi.setup(SwaggerDocument))
App.use('/api/v1/user',userRouter)
App.use('/api/v1/auth',authRoute)