import express from "express"
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts } from "../controllers/product.controller.js";
import { updateCategory } from "../controllers/category.controller.js";

const router=express.Router()


router.get("/getfeatured",getFeaturedProducts)
router.post("/create",createProduct)
router.get("/",getAllProducts)
router.put("/:id",updateCategory)
router.delete("/:id",deleteProduct)

export{ router as productRoutes}