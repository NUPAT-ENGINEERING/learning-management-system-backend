import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import dotenv from 'dotenv';
import { userRouter } from './src/routes/usersRoute/users.route.js';
export const App = express();
dotenv.config({ path: "./config.env" })



App.use(cors())
App.use(helmet())
App.use(express.json())
App.use('/api/v1/user',userRouter)