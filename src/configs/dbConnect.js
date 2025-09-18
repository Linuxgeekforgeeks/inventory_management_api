import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const dbConnect=async()=>{

    try {
        const mongoDb=await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected To MongoDb...")
        
    } catch (error) {
        console.log("Error connnecting to MongoDb"+error)
    }
}

export{ dbConnect }