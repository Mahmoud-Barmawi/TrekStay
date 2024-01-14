import Joi from "joi";
import { generalFileds } from "../../Middleware/validation.js";

export const signUp = Joi.object({
    firstName: Joi.string().min(3).max(20).required(),
    lastName: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    file: generalFileds.file.required(),
}).unknown(true);