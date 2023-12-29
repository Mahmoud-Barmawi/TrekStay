import accommodationModel from "../../../../Database/Models/accommodation.model.js";
import userModel from "../../../../Database/Models/user.model.js";
import { deleteImage, uploadImage } from "../../../Utils/cloudinary_image_uploader.js";
import { hashPassword, passwordDecryption } from "../../../Utils/helper_functions.js";

export const editName = async (req, res) => {
    const { firstName, lastName } = req.body;
    const user = req.user;
    const updateUserName = await userModel.findById(user.id);
    if (firstName) updateUserName.firstName = firstName;
    if (lastName) updateUserName.lastName = lastName;
    await updateUserName.save();
    return res.json({ message: "success", updateUserName });
}
export const editPassword = async (req, res, next) => {
    const { oldPaasword, newPassword } = req.body;
    const user = req.user;
    const getUserData = await userModel.findById(user._id);
    if (!passwordDecryption(getUserData.email, oldPaasword)) return next(new Error("Incorrect Old Password"));
    const hashNewPassword = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(req.user._id, { password: hashNewPassword, passwordChangeTime: Date.now() });
    return res.json({ message: "password updated successfully" });
}
export const editCountry = async (req, res) => {
    const { country } = req.body;
    const user = req.user;
    const updateCountry = await userModel.findById(user.id);
    if (country) updateCountry.country = country;
    await updateCountry.save();
    return res.json({ message: "success", updateCountry });
}
export const editImage = async (req, res, next) => {
    if (!req.file) {
        return next(new Error("Please send your updated profile picture"));
    }
    const user = req.user;
    const updateUserImage = await userModel.findById(user.id);
    const { secure_url, public_id } = await uploadImage(req.file.path, "profile");
    await deleteImage(updateUserImage.image.public_id);
    updateUserImage.image = { secure_url, public_id };
    await updateUserImage.save();
    return res.json({ message: "success", updateUserImage });
}
export const getUserAccommodations = async (req, res, next) => {
    const id=req.user.id;
    const userAccommodation=await accommodationModel.find({createdBy:id});
    if(!userAccommodation) return next (new Error("You haven't created any accommodation yet"));
    return res.json({message:"success",userAccommodation});
}