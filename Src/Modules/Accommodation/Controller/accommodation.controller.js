import slugify from "slugify";
import accommodationModel from "../../../../Database/Models/accommodation.model.js";
import { uploadImage } from "../../../Utils/cloudinary_image_uploader.js";
import { isCategoryAlreadyExistById } from "../../../Utils/helper_functions.js";

export const createAccommodation = async (req, res, next) => {
    const subImages=[];
    const { name,
        describesYourPlace,
        description,
        country,
        town,
        ZIP_code,
        hostName,
        hostPhoneNumber,
        pricePerNight,
        numberOfBedroom,
        numberOfBeds,
        numberOfGuests,
        numberOfBathroom,
        servicesProvided,
        minimumNumberOfNights,
        category} = req.body;
    
    if(!await isCategoryAlreadyExistById(category))
        return next(new Error("Invalid category selected. Please choose a valid category."));
    const { secure_url, public_id } = await uploadImage(req.files.mainImage[0].path, "accommodation/main images");
    for(let iterator of req.files.subImages){
        const { secure_url, public_id } = await uploadImage(iterator.path, "accommodation/sub images");
        subImages.push({secure_url,public_id});
    }
    const accommodation=await accommodationModel.create({
        name:name,
        slug:slugify(name),
        describesYourPlace,
        description,
        country,
        town,
        ZIP_code,
        hostName,
        hostPhoneNumber,
        mainImage:{secure_url,public_id},
        subImages:subImages,
        pricePerNight,
        numberOfBedroom,
        numberOfBeds,
        numberOfGuests,
        numberOfBathroom,
        servicesProvided,
        minimumNumberOfNights,
        category,
        createdBy:req.user._id,
        updatedBy:req.user._id,
        
    })
    return res.json({message:"success",accommodation});
}   