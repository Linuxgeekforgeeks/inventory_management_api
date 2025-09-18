import Brand from "../../src/models/brand.model.js";
import cloudinary from "../../src/lib/cloudinary.js";

export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find({});
    res.json({
      message: "Brands retrieved successfully",
      data: brands,
      success: true,
    });
  } catch (error) {
    console.log("getting AllBrands Controller Error" + error);
    res.status(500).json({ message: "Server Error ", error });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const { name, description, logoImage } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Brand name is Required", success: false });
    }

    const existingBrand = await Brand.findById(brandId);
    if (!existingBrand) {
      return res
        .status(404)
        .json({ message: "Brand not found", success: false });
    }

    let cloudinaryResponse = null;
    if (logoImage && logoImage !== existingBrand.logoImage) {
      // Optionally delete old image from Cloudinary if needed
      if (existingBrand.logoImage) {
        const publicId = existingBrand.logoImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`inventory_brands/${publicId}`);
      }

      cloudinaryResponse = await cloudinary.uploader.upload(logoImage, {
        folder: "inventory_brands",
      });
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      brandId,
      {
        name,
        description,
        logoImage: cloudinaryResponse?.secure_url || existingBrand.logoImage || "",
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Brand updated successfully",
      success: true,
      data: updatedBrand,
    });
  } catch (error) {
    console.log("Error in updating brand: " + error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const createBrand = async (req, res) => {
  try {
    const { name, description, logoImage } = req.body;

    if (!name || !logoImage) {
      return res
        .status(400)
        .json({ message: "Brand name and logoImage are required", success: false });
    }

    let cloudinaryResponse = null;
    cloudinaryResponse = await cloudinary.uploader.upload(logoImage, {
      folder: "inventory_brands",
    });

    const newBrandData = await Brand.create({
      name,
      description,
      logoImage: cloudinaryResponse?.secure_url || "",
    });

    res.status(201).json({
      message: "Brand created successfully",
      success: true,
      data: newBrandData,
    });
  } catch (error) {
    console.log("Error in creating brand: " + error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res
        .status(404)
        .json({ message: "Brand not found", success: false });
    }

    // Optionally delete image from Cloudinary
    if (brand.logoImage) {
      const publicId = brand.logoImage.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`inventory_brands/${publicId}`);
    }

    await Brand.findByIdAndDelete(brandId);

    res.status(200).json({
      message: "Brand deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error in deleting brand: " + error);
    res.status(500).json({ message: "Server Error", error });
  }
};