import slugify from "slugify";
import categoryModel from "../../../../Database/Models/category.model.js";
import { isCategoryAlreadyExist, isCategoryAlreadyExistById } from "../../../Utils/helper_functions.js";
import { uploadImage } from "../../../Utils/cloudinary_image_uploader.js";

export const createCategory = async (req, res, next) => {
    const { name, description } = req.body;
    if (await isCategoryAlreadyExist(name.toLowerCase()))
        return next(new Error(`${name} already exist, please choose another name`));
    const { secure_url, public_id } = await uploadImage(req.file.path, "category");
    const category = await categoryModel.create({
        name: name.toLowerCase(),
        slug: slugify(name),
        description,
        image: { secure_url, public_id },
        createdBy: req.user._id,
        updatedBy: req.user._id,
    })
    return res.json({ message: `${name} was created successfully}`, category });
}

export const getCategories = async (req, res, next) => {
    const categories = await categoryModel.find();
    return res.json({ message: "Success", categories });
}

export const getSpecificCategory = async (req, res, next) => {
    const { id } = req.params;
    const categoryIdExists = await isCategoryAlreadyExistById(id);

    if (!categoryIdExists) {
        return next(new Error(`Category does not exist, please choose another one`));
    }
    return res.json({message:"success",categoryIdExists});
} 
export const getActiveCategories=async(req,res,next)=>{
    const categoriesActives = await categoryModel.find({status:'Active'})
    return res.json({message:"success",categoriesActives});
}