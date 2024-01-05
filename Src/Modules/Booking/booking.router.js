import { Router } from "express";
import * as bookingController from './Controller/booking.controller.js';
import { auth, roles } from "../../Middleware/authentication.js";
import { asyncHandler } from "../../Utils/global_error_handling.js";
const router=Router();

router.post('/BookingAccommodation/:id',auth(roles.USER),asyncHandler(bookingController.bookingAccommodation));
export default router;