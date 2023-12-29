import {Router} from "express"
import * as userController from './Controller/user.controller.js'
import { auth, roles } from "../../Middleware/authentication.js";
import fileUpload, { fileValidation } from "../../Utils/multer.js";
import { asyncHandler } from "../../Utils/global_error_handling.js";
const router=Router();

router.patch('/EditPassword',auth([roles.USER,roles.ADMIN]),asyncHandler(userController.editPassword));

router.patch('/EditName',auth([roles.USER,roles.ADMIN]),asyncHandler(userController.editName));

router.patch('/EditCountry',auth([roles.USER,roles.ADMIN]),asyncHandler(userController.editCountry));

router.patch('/EditProfilePicture',auth([roles.USER,roles.ADMIN]),
fileUpload(fileValidation.image).single('image'),asyncHandler(userController.editImage));


router.get('/GetUserAccommodations',auth([roles.USER]),asyncHandler(userController.getUserAccommodations));

export default router;