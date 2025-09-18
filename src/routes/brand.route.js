import express from "express";
import { createBrand, deleteBrand, getAllBrands, updateBrand } from "../controllers/brand.controller.js";

const router = express.Router();

router.get("/", getAllBrands);
router.post("/create", createBrand);
router.put("/:brandId", updateBrand);
router.delete("/:brandId", deleteBrand);

export { router as brandRoutes };