import express from "express"
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/category.controller.js"

const router =express.Router()

router.get("/",getAllCategories)
router.post("/create",createCategory)
router.put("/:catId",updateCategory)
router.delete("/:catId",deleteCategory)

export {router as categoryRoutes}