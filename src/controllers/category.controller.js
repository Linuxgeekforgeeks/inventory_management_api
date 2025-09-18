import Category from "../models/category.model.js";
import cloudinary from "../../src/lib/cloudinary.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({
      message: "Categories retrieved successfully",
      data: categories,
      success: true,
    });
  } catch (error) {
    console.log("getting AllCategories Controller Error" + error);
    res.status(500).json({ message: "Server Error ", error });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { catId } = req.params;
    const { name, description, color, image } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Category name is Required", success: false });
    }

    const existingCategory = await Category.findById(catId);
    if (!existingCategory) {
      return res
        .status(404)
        .json({ message: "Category not found", success: false });
    }

    let cloudinaryResponse = null;
    if (image && image !== existingCategory.image) {
      // Optionally delete old image from Cloudinary if needed
      if (existingCategory.image) {
        const publicId = existingCategory.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`inventory_categories/${publicId}`);
      }

      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "inventory_categories",
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      catId,
      {
        name,
        description,
        color,
        image: cloudinaryResponse?.secure_url || existingCategory.image || "",
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Category updated successfully",
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    console.log("Error in updating category: " + error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, color, image } = req.body;

    if (!name || !color) {
      return res
        .status(400)
        .json({ message: "Category name and color are required", success: false });
    }

    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "inventory_categories",
      });
    }

    const newCategoryData = await Category.create({
      name,
      description,
      color,
      image: cloudinaryResponse?.secure_url || "",
    });

    res.status(201).json({
      message: "Category created successfully",
      success: true,
      data: newCategoryData,
    });
  } catch (error) {
    console.log("Error in creating category: " + error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { catId } = req.params;
    const category = await Category.findById(catId);
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", success: false });
    }

    // Optionally delete image from Cloudinary
    if (category.image) {
      const publicId = category.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`inventory_categories/${publicId}`);
    }

    await Category.findByIdAndDelete(catId);

    res.status(200).json({
      message: "Category deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error in deleting category: " + error);
    res.status(500).json({ message: "Server Error", error });
  }
};