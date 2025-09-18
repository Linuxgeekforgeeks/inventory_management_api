import express from "express"

const router=express.Router()

router.get("/product",(req,res)=>{
res.send("hello")
})

export{ router as authRoutes}