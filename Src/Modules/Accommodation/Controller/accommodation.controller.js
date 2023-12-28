import slugify from "slugify";
import accommodationModel from "../../../../Database/Models/accommodation.model.js";
import { deleteImage, uploadImage } from "../../../Utils/cloudinary_image_uploader.js";
import { isAccommodationAlreadyExist, isCategoryAlreadyExistById, verifyUserAccommodationCompatibility } from "../../../Utils/helper_functions.js";

export const createAccommodation = async (req, res, next) => {
    const subImages = [];
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
        category } = req.body;

    if (!await isCategoryAlreadyExistById(category))
        return next(new Error("Invalid category selected. Please choose a valid category."));
    const { secure_url, public_id } = await uploadImage(req.files.mainImage[0].path, `accommodation/main images ${name}`);
    for (let iterator of req.files.subImages) {
        const { secure_url, public_id } = await uploadImage(iterator.path, `accommodation/sub images ${name}`);
        subImages.push({ secure_url, public_id });
    }
    const accommodation = await accommodationModel.create({
        name: name,
        slug: slugify(name),
        describesYourPlace,
        description,
        country,
        town,
        ZIP_code,
        hostName,
        hostPhoneNumber,
        mainImage: { secure_url, public_id },
        subImages: subImages,
        pricePerNight,
        numberOfBedroom,
        numberOfBeds,
        numberOfGuests,
        numberOfBathroom,
        servicesProvided,
        minimumNumberOfNights,
        category,
        createdBy: req.user._id,
        updatedBy: req.user._id,

    })
    return res.json({ message: "success", accommodation });
}
export const getAllAccommodations = async (req, res, next) => {
    const accommodation = await accommodationModel.find();
    return res.json({ message: "success", accommodation });
}
export const getAccommodationsByCategoryId = async (req, res, next) => {
    const { id } = req.params;
    if (!await isCategoryAlreadyExistById(id))
        return next(new Error("Invalid category selected. Please choose a valid category."));
    const accommodation = await accommodationModel.find({ category: id });
    if (!accommodation) return next(new Error('"This category currently lacks any available accommodations."'));
    return res.json({ message: 'success', accommodation });
}
export const getAllActiveAccommodations = async (req, res, next) => {
    const accommodation=await accommodationModel.find({status:"Active"});
    if(!accommodation) return next (new Error('No available accommodation found'))
    return res.json({message:"success",accommodation});
}
export const updateAccommodationMainImageAndSubImages = async (req, res, next) => {
    const subImagesArr = [];
    const { id } = req.params;
    const { mainImage, subImages } = req.files;
    let accommodation = await isAccommodationAlreadyExist(id);
    if (!accommodation)
        return next(new Error('The specified accommodation is non-existent'));

    if (!await verifyUserAccommodationCompatibility(id, req.user._id)) {
        return next(new Error('You lack the authorization to modify this accommodation; it does not belong to you.'))
    }
    if (mainImage) {
        const { secure_url, public_id } = await uploadImage(req.files.mainImage[0].path, `accommodation/main images ${accommodation.name}`);
        await deleteImage(accommodation.mainImage.public_id);
        accommodation.mainImage = { secure_url, public_id };
    }
    if (subImages) {
        let counterOnSubImages = 0;
        for (let iterator of subImages) {
            const { secure_url, public_id } = await uploadImage(iterator.path, `accommodation/sub images ${accommodation.name}`);
            await deleteImage(accommodation.subImages[counterOnSubImages].public_id);
            subImagesArr.push({ secure_url, public_id });
            accommodation.subImages[counterOnSubImages] = subImagesArr[counterOnSubImages];
            counterOnSubImages++;
        }
    }
    accommodation.updatedBy = req.user._id;
    await accommodation.save();
    return res.json({ message: "success", accommodation });
}
export const updateAccommodationDetailsAndPlaceDescription = async (req, res, next) => {
    const { name, describesYourPlace, description } = req.body;
    const { id } = req.params;
    let accommodation = await isAccommodationAlreadyExist(id);
    if (!accommodation)
        return next(new Error('The specified accommodation is non-existent'));
    if (!await verifyUserAccommodationCompatibility(id, req.user._id)) {
        return next(new Error('You lack the authorization to modify this accommodation; it does not belong to you.'))
    }
    if (name) {
        accommodation.name = name;
        accommodation.slug = slugify(name);
    }
    if (describesYourPlace) {
        accommodation.describesYourPlace = describesYourPlace;
    }
    if (description) {
        accommodation.description = description;
    }
    accommodation.updatedBy = req.user._id;
    await accommodation.save();
    return res.json({ message: "success", accommodation });
}
export const updateAccommodationLocationPostalCode = async (req, res, next) => {
    const { country, town, ZIP_code } = req.body;
    const { id } = req.params;
    let accommodation = await isAccommodationAlreadyExist(id);
    if (!accommodation)
        return next(new Error('The specified accommodation is non-existent'));
    if (!await verifyUserAccommodationCompatibility(id, req.user._id)) {
        return next(new Error('You lack the authorization to modify this accommodation; it does not belong to you.'))
    }
    if (country) {
        accommodation.country = country;
    }
    if (town) {
        accommodation.town = town;
    }
    if (ZIP_code) {
        accommodation.ZIP_code = ZIP_code;
    }
    accommodation.updatedBy = req.user._id;
    await accommodation.save();
    return res.json({ message: "success", accommodation });
}
export const updateAccommodationHostContactInfo = async (req, res, next) => {
    const { hostName, hostPhoneNumber } = req.body;
    const { id } = req.params;
    let accommodation = await isAccommodationAlreadyExist(id);
    if (!accommodation)
        return next(new Error('The specified accommodation is non-existent'));
    if (!await verifyUserAccommodationCompatibility(id, req.user._id)) {
        return next(new Error('You lack the authorization to modify this accommodation; it does not belong to you.'))
    }
    if (hostName) {
        accommodation.hostName = hostName;
    }
    if (hostPhoneNumber) {
        accommodation.hostPhoneNumber = hostPhoneNumber;
    }
    accommodation.updatedBy = req.user._id;
    await accommodation.save();
    return res.json({ message: "success", accommodation });
}
export const updateAccommodationDetails = async (req, res, next) => {
    const {
        pricePerNight,
        numberOfBedroom,
        numberOfBeds,
        numberOfGuests,
        numberOfBathroom,
        servicesProvided,
        minimumNumberOfNights, } = req.body;
    const { id } = req.params;
    let accommodation = await isAccommodationAlreadyExist(id);
    if (!accommodation)
        return next(new Error('The specified accommodation is non-existent'));
    if (!await verifyUserAccommodationCompatibility(id, req.user._id)) {
        return next(new Error('You lack the authorization to modify this accommodation; it does not belong to you.'))
    }
    if (pricePerNight) {
        accommodation.pricePerNight = pricePerNight;
    }
    if (numberOfBedroom) {
        accommodation.numberOfBedroom = numberOfBedroom;
    }
    if (numberOfBeds) {
        accommodation.numberOfBeds = numberOfBeds;
    }
    if (numberOfGuests) {
        accommodation.numberOfGuests = numberOfGuests;
    }
    if (numberOfBathroom) {
        accommodation.numberOfBathroom = numberOfBathroom;
    }
    if (servicesProvided) {
        accommodation.servicesProvided = servicesProvided;
    }
    if (minimumNumberOfNights) {
        accommodation.minimumNumberOfNights = minimumNumberOfNights;
    }

    accommodation.updatedBy = req.user._id;
    await accommodation.save();
    return res.json({ message: "success", accommodation });
}
export const updateAccommodationStatus = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    let accommodation = await isAccommodationAlreadyExist(id);
    if (!accommodation)
        return next(new Error('The specified accommodation is non-existent'));
    if (!await verifyUserAccommodationCompatibility(id, req.user._id)) {
        return next(new Error('You lack the authorization to modify this accommodation; it does not belong to you.'))
    }
    if (status) {
        accommodation.status = status;
    }
    accommodation.updatedBy = req.user._id;
    await accommodation.save();
    return res.json({ message: "success", accommodation });
}
export const deleteAccommodation = async (req, res, next) => {
    const { id } = req.params;
    let accommodation = await isAccommodationAlreadyExist(id);
    if (!accommodation)
        return next(new Error('The specified accommodation is non-existent'));
    if (!await verifyUserAccommodationCompatibility(id, req.user._id)) {
        return next(new Error('You lack the authorization to modify this accommodation; it does not belong to you.'))
    }
    await accommodationModel.findByIdAndDelete(id);
    return res.json({ message: "success" });
}

