import { Router } from "express";
import * as bookingController from "./Controller/booking.controller.js";
import { auth, roles } from "../../Middleware/authentication.js";
import { asyncHandler } from "../../Utils/global_error_handling.js";
const router = Router();

router.post(
  "/BookingAccommodation/:id",
  auth(roles.USER),
  asyncHandler(bookingController.bookingAccommodation)
);

router.get(
  "/GetAllBookingsForAdmin",
  auth(roles.ADMIN),
  asyncHandler(bookingController.getAllBookingForAdmin)
);

router.get(
  "/GetUserBookings",
  auth(roles.USER),
  asyncHandler(bookingController.getUserBookings)
);

router.delete(
  "/DeleteBookingByUser/:id/:accommodationId/:checkInDate",
  auth(roles.USER),
  asyncHandler(bookingController.deleteBookingByUser)
);

router.delete(
  "/DeleteAllBookingsByUser/:id",
  auth(roles.USER),
  asyncHandler(bookingController.deleteAllBookingsByUser)
);
export default router;
