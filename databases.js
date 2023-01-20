import Sequelize from "sequelize";
import { Config } from "./src/config/config.js";

export const sequelize = new Sequelize(Config.DATABASE,Config.DATABASE_USER,Config.DATABASE_PASSWORD,{
    host: 'localhost',
    dialect: 'mysql'
})