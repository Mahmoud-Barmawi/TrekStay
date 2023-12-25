import cloudinary from "./cloudinary.js";

export async function uploadImage(path, folderName) {
    return await cloudinary.uploader.upload(path, {
        folder: `${process.env.APPNAME}/${folderName}`
    });
}

export async function deleteImage(nameId) {
    await cloudinary.uploader.destroy(nameId);
}