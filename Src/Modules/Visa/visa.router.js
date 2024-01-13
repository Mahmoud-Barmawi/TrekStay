import { Router } from "express";
import * as visaController from './Controller/visa.controller.js'
import { auth, roles } from "../../Middleware/authentication.js";
import { asyncHandler } from "../../Utils/global_error_handling.js";
const router = Router();
router.post('/FillVisaDetails', auth(roles.USER), asyncHandler(visaController.fillVisaDetails));
export default router;