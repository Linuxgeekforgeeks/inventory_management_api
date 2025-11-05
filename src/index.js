import express from "express"
import { indexRoutes } from "./routes/index.js"
import { dbConnect } from "./configs/dbConnect.js"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import "../src/cronJobs/index.js"

dotenv.config()

const app=express()


//middlewares
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:3000","https://big-ecommerce-2fa-auth.vercel.app"], // frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true // if sending cookies
}));
app.use(cookieParser())

//testingRoutes
app.get("/api/test/",(req,res)=>{
    res.send("Test")
})


//Routes
dbConnect()
app.use("/api",indexRoutes)

const PORT=process.env.PORT||4000

app.listen(PORT,()=>{
    console.log("Our Server is running on the port "+PORT)
})