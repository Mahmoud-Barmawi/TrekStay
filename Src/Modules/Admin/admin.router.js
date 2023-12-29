import {Router} from 'express';
import * as adminController from './Controller/admin.controller.js'
import { auth, roles } from '../../Middleware/authentication.js';
import { asyncHandler } from '../../Utils/global_error_handling.js';
const router=Router();

router.post('/ConfirmAccommodationPublished/:id',auth(roles.ADMIN),asyncHandler(adminController.confirmAccommodationPublished));

export default router;