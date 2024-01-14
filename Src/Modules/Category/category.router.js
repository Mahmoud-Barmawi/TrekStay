import { Router } from 'express'
import * as categoryController from './Controller/category.controller.js'
import { auth, roles } from '../../Middleware/authentication.js';
import fileUpload, { fileValidation } from '../../Utils/multer.js';
import { asyncHandler } from '../../Utils/global_error_handling.js';
import { validation } from '../../Middleware/validation.js';
import * as validators from './category.validation.js'
const router = Router();

router.post('/CreateCategory', auth(roles.ADMIN), fileUpload(fileValidation.image).single('image'),
    validation(validators.createCategory),
    asyncHandler(categoryController.createCategory));

router.get('/GetSpecificCategory/:id', asyncHandler(categoryController.getSpecificCategory));

router.get('/GetCategories', auth(roles.ADMIN), asyncHandler(categoryController.getCategories));

router.get('/GetActiveCategories', asyncHandler(categoryController.getActiveCategories));

router.patch('/EditCategoryName/:id', auth(roles.ADMIN), asyncHandler(categoryController.updateCategoryName));

router.put('/EditCategoryInfo/:id', auth(roles.ADMIN), asyncHandler(categoryController.updateCategoryInfo));

router.patch('/EditCategoryImage/:id', auth(roles.ADMIN), fileUpload(fileValidation.image).single('image'),
    asyncHandler(categoryController.updateCategoryImage));

router.patch('/DeleteCategory/:id', auth(roles.ADMIN), asyncHandler(categoryController.deleteCategory));

export default router;