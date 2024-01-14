import Joi from "joi";
export const validation = (schema) => {
    return (req, res, next) => {
        const inputData = { ...req.body };
        if (req.file || req.files)
            inputData.file = req.file || req.files;

        const validationResult = schema.validate(inputData, { abortEarly: false });
        if (validationResult.error?.details)
            return res.json({ message: "validation error", validationResult: validationResult.error?.details });

        next();
    }
}
export const generalFileds = {
    file: Joi.object(
        {
            fieldname: Joi.string().required(),
            originalname: Joi.string().required(),
            encoding: Joi.string().required(),
            mimetype: Joi.string().required(),
            des: Joi.string(),
            destination: Joi.string().required(),
            filename: Joi.string().required(),
            path: Joi.string().required(),
            size: Joi.number().positive().required(),
        }
    )
}