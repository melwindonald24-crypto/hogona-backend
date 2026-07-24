import { setServers } from "dns/promises";
import  dotenv from "dotenv";
dotenv.config()
import express from "express"
import authRoutes from "./Authentication/router/authenticationRoutes.js";
import  mongoose from "mongoose";
import cookieParser from "cookie-parser"
import profileRoutes from "./Users/routes/profileRoutes.js";
setServers(["8.8.8.8", "1.1.1.1"]);


const app=express()
const port=process.env.PORT 
app.use(express.json())
app.use(cookieParser())

async function main()
{
    app.use(authRoutes)
    app.use(profileRoutes)
    

    try{
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING)

        console.log("connection established")

        app.listen(port,()=>{
            console.log("server started successfully")
        })

    }catch(error)
    {
        console.log("an error occured "+error.message)
    }
}

main()