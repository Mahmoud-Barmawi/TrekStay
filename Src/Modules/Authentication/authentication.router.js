import { Router } from "express";
import * as authenticationController from './Controller/authentication.controller.js';
import { asyncHandler } from "../../Utils/global_error_handling.js";
import fileUpload, { fileValidation } from "../../Utils/multer.js";
import { validation } from "../../Middleware/validation.js";
import * as validator from './authentication.validation.js'
const router = Router();

router.post('/signup', fileUpload(fileValidation.image).single('image'), validation(validator.signUp), asyncHandler(authenticationController.signUp));
router.post('/signin', asyncHandler(authenticationController.signIn));
router.get('/confirmEmail/:email', asyncHandler(authenticationController.updateConfirmEmail));
router.patch('/sendCode', asyncHandler(authenticationController.resetPasswordCode));
router.patch('/forgotPassword', asyncHandler(authenticationController.forgotPassword))
export default router;