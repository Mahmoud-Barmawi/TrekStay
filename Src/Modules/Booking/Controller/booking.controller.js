import accommodationModel from "../../../../Database/Models/accommodation.model.js";
import bookingModel from "../../../../Database/Models/booking.model.js";
import {
  addNewBooking,
  checkAvailability,
  checkNumberOfGuests,
  checkNumberOfNights,
  getAccommodationData,
  hasUserAnyBookings,
  hasUserPermissionToDeleteBooking,
  hasUserThisAccommodationToDeleteBooking,
  userHasBookings,
} from "../../../Utils/helper_functions.js";

export const bookingAccommodation = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { checkIn, checkOut, numberOfGuests } = req.body;

  const checkAccommdation = await getAccommodationData(id);
  if (!checkAccommdation)
    return next(new Error(`The specified Accommodation is not found`));

  const resultAvailability = await checkAvailability(id, checkIn, checkOut);
  if (!resultAvailability.available)
    return next(new Error(`The requested booking period is not available`));

  const { available, minimumNumberOfNights } = await checkNumberOfNights(
    id,
    resultAvailability.numberOfDays
  );
  if (!available)
    return next(
      new Error(
        `This accommodation requires a minimum booking of ${minimumNumberOfNights} nights`
      )
    );

  const { availableNumberOfGuests, maximumNumberOfGuests } =
    await checkNumberOfGuests(id, numberOfGuests);
  if (!availableNumberOfGuests)
    return next(
      new Error(
        `This accommodation can only accommodate a maximum of ${maximumNumberOfGuests} individuals`
      )
    );

  // check if user has a booking, and if not make one if yes add data to array

  const checkUserBookings = await userHasBookings(userId);
  if (checkUserBookings) {
    const resultAddBooking = await addNewBooking(
      userId,
      checkIn,
      checkOut,
      numberOfGuests,
      resultAvailability.numberOfDays,
      id
    );
    if (resultAddBooking) return res.json({ message: "success" });
  }
  const createBookingToUser = await bookingModel.create({
    userId,
    checkIn: [checkIn],
    checkOut: [checkOut],
    numberOfNights: [resultAvailability.numberOfDays],
    numberOfGuests: [numberOfGuests],
    totlaPriceForAllNights: [
      resultAvailability.numberOfDays * checkAccommdation.pricePerNight,
    ],
    bookings: [id],
  });
  checkAccommdation.checkIn.push(checkIn);
  checkAccommdation.checkOut.push(checkOut);
  await checkAccommdation.save();
  return res.json({ message: "success", createBookingToUser });
};

export const getAllBookingForAdmin = async (req, res, next) => {
  const bookings = await bookingModel.find();

  const formattedBookings = bookings.map((booking) => ({
    _id: booking._id,
    userId: booking.userId,
    bookings: booking.bookings.map((bookingId, index) => ({
      id: bookingId,
      checkIn: booking.checkIn[index],
      checkOut: booking.checkOut[index],
      numberOfNights: booking.numberOfNights[index],
      numberOfGuests: booking.numberOfGuests[index],
      totlaPriceForAllNights: booking.totlaPriceForAllNights[index],
    })),
  }));

  return res.json({ message: "success", UsersBookings: formattedBookings });
};
export const getUserBookings = async (req, res, next) => {
  const bookings = await bookingModel.find({ userId: req.user._id });
  if (!bookings) {
    return next(new Error(`You don't have any bookings`));
  }
  const formattedBookings = bookings.map((booking) => ({
    _id: booking._id,
    userId: booking.userId,
    bookings: booking.bookings.map((bookingId, index) => ({
      id: bookingId,
      checkIn: booking.checkIn[index],
      checkOut: booking.checkOut[index],
      numberOfNights: booking.numberOfNights[index],
      numberOfGuests: booking.numberOfGuests[index],
      totlaPriceForAllNights: booking.totlaPriceForAllNights[index],
    })),
  }));

  return res.json({ message: "success", UserBookings: formattedBookings });
};

export const deleteBookingByUser = async (req, res, next) => {
  const {id,accommodationId} = req.params;
  const userHasBookings = await hasUserAnyBookings(req.user._id);
  const userHasPermission = await hasUserPermissionToDeleteBooking(
    id,
    req.user._id
  );
  const userHasThisAccommodationToDelete =
    await hasUserThisAccommodationToDeleteBooking(
      accommodationId,
      req.user._id
    );

  if (!userHasBookings) {
    return next(new Error(`You don't have any bookings to delete`));
  }

  if (!userHasPermission) {
    return next(new Error(`You don't have permission to delete this booking`));
  }

  if (!userHasThisAccommodationToDelete) {
    return next(new Error(`You don't have this accommodation to delete`));
  }

  const deleteBooking = await bookingModel.findById({_id:id});
  const emptyAccommodation=await accommodationModel.find({_id:accommodationId});


  // 
  /*
  send check in date when we want to de;ete accommodation
  */
  for (let i = deleteBooking.bookings.length - 1; i >= 0; i--) {
    if (deleteBooking.bookings[i] === accommodationId) {
      deleteBooking.bookings.splice(i, 1);
      deleteBooking.checkIn.splice(i, 1);
      deleteBooking.checkOut.splice(i, 1);
      // emptyAccommodation.checkIn.splice(i, 1);
      // emptyAccommodation.checkOut.splice(i, 1);
      deleteBooking.numberOfNights.splice(i, 1);
      deleteBooking.numberOfGuests.splice(i, 1);
      deleteBooking.totlaPriceForAllNights.splice(i, 1);
    }
  }

  await deleteBooking.save();
  await emptyAccommodation.save();
  return res.json({ message: "Booking deleted successfully" });
};
