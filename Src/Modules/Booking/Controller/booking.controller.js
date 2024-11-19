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
  isVisaAvailable,
  splitString,
  userHasBookings,
} from "../../../Utils/helper_functions.js";

export const bookingAccommodation = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { checkIn, checkOut, numberOfGuests, cardNumber, cardPassword } = req.body;
  const concateHelper = "HaMa__";
  const concatenatedUserIdAndCheckIn = checkIn + concateHelper + userId;
  const concatenatedUserIdAndCheckOut = checkOut + concateHelper + userId;
  const checkAccommdation = await getAccommodationData(id);

  if (!checkAccommdation)
    return next(new Error(`The specified Accommodation is not found`));

  const resultAvailability = await checkAvailability(id, checkIn, checkOut);
  if (!resultAvailability.available)
    return next(new Error(`The requested booking period is not available`));

  const { available, minimumNumberOfNights } = await checkNumberOfNights(id, resultAvailability.numberOfDays);
  if (!available)
    return next(new Error(`This accommodation requires a minimum booking of ${minimumNumberOfNights} nights`));

  const { availableNumberOfGuests, maximumNumberOfGuests } = await checkNumberOfGuests(id, numberOfGuests);
  if (!availableNumberOfGuests) return next(new Error(`This accommodation can only accommodate a maximum of ${maximumNumberOfGuests} individuals`));

  
  const { isAvailable, visaDetails } = await isVisaAvailable(userId, cardNumber, cardPassword);

  if (!isAvailable) return next(new Error(`Please verify your visa information. There seems to be an issue with the entered details`));

  const { amountOfMoney } = visaDetails;
  if (parseInt(amountOfMoney) < parseInt(checkAccommdation.pricePerNight * resultAvailability.numberOfDays))
    return next(new Error(`You do not have enough money to book this accommodation for this period of time`));

  const checkUserBookings = await userHasBookings(userId);
  if (checkUserBookings) {
    const resultAddBooking = await addNewBooking(userId, checkIn, checkOut, numberOfGuests, resultAvailability.numberOfDays, id, visaDetails);
    if (resultAddBooking) {
      checkAccommdation.checkIn.push(concatenatedUserIdAndCheckIn);
      checkAccommdation.checkOut.push(concatenatedUserIdAndCheckOut);
      await checkAccommdation.save();
      return res.json({ message: "success" });
    }

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
  checkAccommdation.checkIn.push(concatenatedUserIdAndCheckIn);
  checkAccommdation.checkOut.push(concatenatedUserIdAndCheckOut);
  await checkAccommdation.save();
  visaDetails.amountOfMoney = parseInt(amountOfMoney) - parseInt(checkAccommdation.pricePerNight * resultAvailability.numberOfDays);
  await visaDetails.save();
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
  const { id, accommodationId, checkInDate } = req.params;
  const concateHelper = "HaMa__";
  const paramDate = new Date(checkInDate);
  const userHasBookings = await hasUserAnyBookings(req.user._id);
  const userHasPermission = await hasUserPermissionToDeleteBooking(id, req.user._id);
  const userHasThisAccommodationToDelete = await hasUserThisAccommodationToDeleteBooking(accommodationId, req.user._id);

  if (!userHasBookings) {
    return next(new Error(`You don't have any bookings to delete`));
  }

  if (!userHasPermission) {
    return next(new Error(`You don't have permission to delete this booking`));
  }

  if (!userHasThisAccommodationToDelete) {
    return next(new Error(`You don't have this accommodation to delete`));
  }

  const deleteBooking = await bookingModel.findById({ _id: id });
  const emptyAccommodation = await accommodationModel.findOne({
    _id: accommodationId
  });

  for (let i = deleteBooking.bookings.length - 1; i >= 0; i--) {
    if (deleteBooking.bookings[i] === accommodationId && paramDate.getTime() === deleteBooking.checkIn[i].getTime()) {
      deleteBooking.bookings.splice(i, 1);
      deleteBooking.checkIn.splice(i, 1);
      deleteBooking.checkOut.splice(i, 1);
      deleteBooking.numberOfNights.splice(i, 1);
      deleteBooking.numberOfGuests.splice(i, 1);
      deleteBooking.totlaPriceForAllNights.splice(i, 1);
    }
  }

  for (let i = emptyAccommodation.checkIn.length - 1; i >= 0; i--) {
    const concatenatedUserIdAndCheckIn = checkInDate + concateHelper + req.user._id;
    if (emptyAccommodation.checkIn[i] == concatenatedUserIdAndCheckIn) {
      emptyAccommodation.checkIn.splice(i, 1);
      emptyAccommodation.checkOut.splice(i, 1);
    }
  }
  await deleteBooking.save();
  await emptyAccommodation.save();
  return res.json({ message: "Booking deleted successfully" });
};

export const deleteAllBookingsByUser = async (req, res, next) => {
  const { id } = req.params;
  const userHasPermission = await hasUserPermissionToDeleteBooking(id, req.user._id);
  if (!userHasPermission) {
    return next(new Error(`You don't have permission to delete this booking`));
  }
  await bookingModel.deleteOne({ _id: id });
  let getAllAccommodations = await accommodationModel.find().select("checkIn checkOut");

  for (let i = 0; i < getAllAccommodations.length; i++) {
    // Update checkIn array
    getAllAccommodations[i].checkIn = getAllAccommodations[i].checkIn.filter(dateStr => {
      const idUser = splitString(dateStr).dynamicString;
      return idUser != req.user._id;
    });

    // Update checkOut array
    getAllAccommodations[i].checkOut = getAllAccommodations[i].checkOut.filter(dateStr => {
      const idUser = splitString(dateStr).dynamicString;
      return idUser != req.user._id;
    });

    // Save the document
    await getAllAccommodations[i].save();
  }

  return res.json({
    success: true, message: getAllAccommodations,
  });
};
