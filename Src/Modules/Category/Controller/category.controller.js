import slugify from "slugify";
import categoryModel from "../../../../Database/Models/category.model.js";
import { isCategoryAlreadyExist, isCategoryAlreadyExistById } from "../../../Utils/helper_functions.js";
import { deleteImage, uploadImage } from "../../../Utils/cloudinary_image_uploader.js";
import accommodationModel from "../../../../Database/Models/accommodation.model.js";

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
    return res.json({ message: "success", categoryIdExists });
}
export const getActiveCategories = async (req, res, next) => {
    const categoriesActives = await categoryModel.find({ status: 'Active' })
    return res.json({ message: "success", categoriesActives });
}
export const updateCategoryName = async (req, res, next) => {
    const { name } = req.body;
    if (await isCategoryAlreadyExist(name.toLowerCase()))
        return next(new Error(`${name} already exist, please choose another name`));
    const category = await categoryModel.findByIdAndUpdate({ _id: req.params.id }, { name: name.toLowerCase(), slug: slugify(name.toLowerCase()), updatedBy: req.user._id }, { new: true });
    return res.json({ message: `success`, category });
}
export const updateCategoryInfo = async (req, res, next) => {
    const { id } = req.params;

    const { description, status } = req.body;
    const updateFields = {};
    if (description) {
        updateFields.description = description;
    }
    if (status) {
        updateFields.status = status;
    }
    updateFields.updatedBy = req.user._id;
    const updatedCategory = await categoryModel.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updatedCategory) return next(new Error(`Category not found`));
    return res.json({ message: "success", category: updatedCategory });
}
export const updateCategoryImage = async (req, res, next) => {
    const { id } = req.params;
    const category=await categoryModel.findById(id);
    if(!category) return next(new Error(`Category not found`)); 
    if(req.file){
        const { secure_url, public_id } = await uploadImage(req.file.path, "category");
        await deleteImage(category.image.public_id);
        category.image={ secure_url, public_id };
    }
    category.updatedBy=req.user._id;
    await category.save();
    return res.json({message:"success",category});
}
export const deleteCategory=async(req,res,next)=>{
    const {id}=req.params;
    const categoryIdExists = await isCategoryAlreadyExistById(id);
    if (!categoryIdExists) {
        return next(new Error(`Category does not exist, please choose another one`));
    }
    const category=await categoryModel.findByIdAndUpdate(id,{status:"Inactive"},{new:true});

    await accommodationModel.updateMany({category:id},{status:"Inactive"});
    return res.json({message:"success",category});
}
