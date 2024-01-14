import Joi from "joi";
import { generalFileds } from "../../Middleware/validation.js";

export const createCategory = Joi.object({
    name: Joi.string().min(8).max(35).required(),
    description: Joi.string().min(30).max(200).required(),
    file: generalFileds.file.required(),
}).unknown(true);