import {Router} from 'express'
import * as accommodationController from './Controller/accommodation.controller.js'
import { auth, roles } from '../../Middleware/authentication.js';
import { asyncHandler } from '../../Utils/global_error_handling.js';
import fileUpload, { fileValidation } from '../../Utils/multer.js';
const router=Router();

router.post('/CreateAccommodation',auth(roles.USER),
fileUpload(fileValidation.image).fields([
    {name:'mainImage', maxCount:1},
    {name:'subImages', maxCount:8},
]),asyncHandler(accommodationController.createAccommodation));

router.get('/GetAllAccommodations',auth(roles.USER),
asyncHandler(accommodationController.getAllAccommodations));


router.get('/RetrieveAccommodationAssociatedWithSpecificCategory/:id',
auth(roles.USER),asyncHandler(accommodationController.getAccommodationsByCategoryId));

router.get('/RetrieveAllActiveAccommodations',
auth(roles.USER),asyncHandler(accommodationController.getAllActiveAccommodations));

router.put('/EditAccommodationImageAndSubImages/:id',auth(roles.USER),
fileUpload(fileValidation.image).fields([
    {name:'mainImage', maxCount:1},
    {name:'subImages', maxCount:8},
]),asyncHandler(accommodationController.updateAccommodationMainImageAndSubImages));


router.put('/EditAccommodationDetailsAndPlaceDescription/:id',auth(roles.USER),
asyncHandler(accommodationController.updateAccommodationDetailsAndPlaceDescription));

router.put('/EditAccommodationLocationPostalCode/:id',auth(roles.USER),
asyncHandler(accommodationController.updateAccommodationLocationPostalCode));


router.put('/EditAccommodationHostContactInfo/:id',auth(roles.USER),
asyncHandler(accommodationController.updateAccommodationHostContactInfo));


router.put('/EditAccommodationDetails/:id',auth(roles.USER),
asyncHandler(accommodationController.updateAccommodationDetails));

router.patch('/EditAccommodationStatus/:id',auth(roles.USER),
asyncHandler(accommodationController.updateAccommodationStatus));

router.delete('/DeleteAccommodation/:id',auth(roles.USER),
asyncHandler(accommodationController.deleteAccommodation));
export default router;