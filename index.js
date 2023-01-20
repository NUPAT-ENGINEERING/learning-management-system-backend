import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import dotenv from 'dotenv';
export const App = express();
dotenv.config({ path: "./config.env" })



App.use(cors())
App.use(helmet())
