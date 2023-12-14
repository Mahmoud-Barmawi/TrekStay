import multer from "multer";

export const fileValidation = {
    image: ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'],
};

function fileUpload(customValidation = []) {
    const storage = multer.diskStorage({});

    function fileFilter(req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file format. Please upload a valid image.'), false);
        }
    }

    const upload = multer({ fileFilter, storage });
    return upload;
}

export default fileUpload;
