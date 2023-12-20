import {Router} from 'express'
import * as categoryController from './Controller/category.controller.js'
import { auth, roles } from '../../Middleware/authentication.js';
import fileUpload, { fileValidation } from '../../Utils/multer.js';
const router=Router();

router.post('/CreateCategory',auth(roles.ADMIN),fileUpload(fileValidation.image).single('image'),categoryController.createCategory);
router.get('/GetSpecificCategory/:id',categoryController.getSpecificCategory);
router.get('/GetCategories',auth(roles.ADMIN),categoryController.getCategories);
router.get('/GetActiveCategories',categoryController.getActiveCategories);

export default router;