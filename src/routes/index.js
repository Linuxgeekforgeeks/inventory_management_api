import express from "express"
import { authRoutes } from "./auth.route.js"
import { productRoutes } from "./product.route.js"
import { oderRoutes } from "./order.route.js"
import { userRoutes } from "./user.route.js"
import { categoryRoutes } from "./category.route.js"
import { brandRoutes } from "./brand.route.js"
import { messageRoutes } from "./message.route.js"

const router=express.Router()

router.use("auths",authRoutes)
router.use("/products",productRoutes)
router.use("orders",oderRoutes)
router.use("/users/",userRoutes)
router.use("/messages/",messageRoutes)
router.use("/categories/",categoryRoutes)
router.use("/brands/",brandRoutes)

export {router as indexRoutes}