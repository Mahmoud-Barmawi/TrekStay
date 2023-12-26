import {Router} from 'express'
import * as accommodationController from './Controller/accommodation.controller.js'
import { auth, roles } from '../../Middleware/authentication.js';
import { asyncHandler } from '../../Utils/global_error_handling.js';
import fileUpload, { fileValidation } from '../../Utils/multer.js';
const router=Router();

router.post('/CreateAccommodation',auth(roles.USER),fileUpload(fileValidation.image).fields([
    {name:'mainImage', maxCount:1},
    {name:'subImages', maxCount:8},
]),asyncHandler(accommodationController.createAccommodation));

router.get('/GetAllAccommodations',auth(roles.USER),asyncHandler(accommodationController.getAllAccommodations));

router.put('/EditAccommodationImageAndSubImages/:id',auth(roles.USER),fileUpload(fileValidation.image).fields([
    {name:'mainImage', maxCount:1},
    {name:'subImages', maxCount:8},
]),asyncHandler(accommodationController.updateAccommodationMainImageAndSubImages));

router.get('/RetrieveAccommodationAssociatedWithSpecificCategory/:id',
auth(roles.USER),asyncHandler(accommodationController.getAccommodationsByCategoryId));
export default router;