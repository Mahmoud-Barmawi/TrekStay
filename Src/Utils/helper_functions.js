import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../../Database/Models/user.model.js";
import { customAlphabet } from "nanoid";
import categoryModel from "../../Database/Models/category.model.js";
import accommodationModel from "../../Database/Models/accommodation.model.js";
import wishlistModle from "../../Database/Models/wishlist.model.js";
import moment from "moment";
import bookingModel from "./../../Database/Models/booking.model.js";

export async function isEmailAlreadyRegistered(email) {
  const checkEmail = await userModel.findOne({ email });
  return Boolean(checkEmail);
}

export function generateEmailConfirmationToken(email) {
  return jwt.sign({ email }, process.env.EMAILSECRET);
}

export async function hashPassword(password) {
  const hashPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALTROUND)
  );
  return hashPassword;
}

export function verifyToken(token, dotenvVariable) {
  const checkToken = jwt.verify(token, dotenvVariable);
  return checkToken;
}

export async function isEmailConfirmed(email) {
  const user = await userModel.findOne({ email });
  return Boolean(user.confirmEmail);
}

export async function passwordDecryption(email, password) {
  const user = await userModel.findOne({ email });
  const hashPassword = await bcrypt.compare(password, user.password);
  return Boolean(hashPassword);
}

export async function createToken(email) {
  const user = await userModel.findOne({ email });
  const token = jwt.sign(
    { id: user._id, role: user.role, status: user.status },
    process.env.LOGINSECRET
  );
  return token;
}

export function generateCode() {
  let code = customAlphabet("123456789abcdzABCDZ", 6);
  return (code = code());
}

export async function checkValidCode(email, code) {
  const user = await userModel.findOne({ email });
  if (user.sendCode != code) {
    return false;
  }
  return true;
}

export function checkBearerKey(authorization) {
  if (authorization?.startsWith(process.env.BEARERKEY)) return true;
  return false;
}

export function splitToken(authorization) {
  return authorization.split(process.env.BEARERKEY);
}

export function checkchangePasswordTime(user, tokenVerfied) {
  if (parseInt(user.passwordChangeTime?.getTime() / 1000) > tokenVerfied.iat)
    return true;
  return false;
}
export function userRole(Roles, user) {
  if (Roles.includes(user.role)) return true;
  return false;
}

export async function isCategoryAlreadyExist(categoryName) {
  const checkCategory = await categoryModel.findOne({
    name: categoryName.toLowerCase(),
  });
  return Boolean(checkCategory);
}
export async function isCategoryAlreadyExistById(categoryIdentifier) {
  const checkCategory = await categoryModel.findById(categoryIdentifier);
  return checkCategory;
}
export async function isAccommodationAlreadyExist(id) {
  const checkAccommodation = await accommodationModel.findById(id);
  return checkAccommodation;
}
export async function verifyUserAccommodationCompatibility(
  accommodation_id,
  user_id
) {
  const accommodationCreatedBy = await accommodationModel.findById(
    accommodation_id
  );
  if (accommodationCreatedBy.createdBy.equals(user_id)) return true;
  return false;
}

export async function userHasWishlist(userId) {
  const checkUser = await wishlistModle.findOne({ userId });
  return Boolean(checkUser);
}
export async function addAccommodationToWishlist(
  accommodationsId,
  wishlistName,
  userId
) {
  const addAccommodation = await wishlistModle.findOne({ userId });
  addAccommodation.accommodations.push(accommodationsId);
  addAccommodation.wishlistName.push(wishlistName.toLowerCase());
  await addAccommodation.save();
  return true;
}

export async function checkAccommodation(accommodationsId) {
  const checkAccommodation = await wishlistModle.findOne({
    accommodations: accommodationsId,
  });
  return Boolean(checkAccommodation);
}
export async function isWishlistAlreadyExist(id) {
  const wishlist = await wishlistModle.findById(id);
  return Boolean(wishlist);
}
export async function hasUserWishlist(wishlistId, userId) {
  const wishlist = await wishlistModle.findById(wishlistId);
  if (userId.equals(userId)) return true;
  return false;
}
export async function isWishlistWithNamePresent(oldName) {
  let result;
  const wishlistName = await wishlistModle.find();
  for (let iterator of wishlistName) {
    result = iterator.wishlistName.includes(oldName);
  }
  return result;
}

// Function to check availability
export async function checkAvailability(
  accommodationId,
  requestedCheckIn,
  requestedCheckOut
) {
  const accommodation = await accommodationModel.findById(accommodationId);

  // Convert requested dates to moment.js objects for easier comparison
  const requestedStart = moment(requestedCheckIn);
  const requestedEnd = moment(requestedCheckOut);

  // Calculate the number of days between requestedCheckIn and requestedCheckOut
  const numberOfDays = requestedEnd.diff(requestedStart, "days");
  for (let i = 0; i < accommodation.checkIn.length; i++) {
    // Convert booking dates to moment.js objects
    const dateCheckIn = splitString(accommodation.checkIn[i]).date;
    const dateCheckOut = splitString(accommodation.checkOut[i]).date;
    const bookingStart = moment(dateCheckIn);
    const bookingEnd = moment(dateCheckOut);

    // If the requested check in date is between an existing booking, it's not available
    if (requestedStart.isBetween(bookingStart, bookingEnd, null, "[]")) {
      return { available: false, numberOfDays };
    }

    // If the requested check out date is between an existing booking, it's not available
    if (requestedEnd.isBetween(bookingStart, bookingEnd, null, "[]")) {
      return { available: false, numberOfDays };
    }

    // If the requested check in date is before and check out date is after an existing booking, it's not available
    if (
      requestedStart.isSameOrBefore(bookingStart) &&
      requestedEnd.isSameOrAfter(bookingEnd)
    ) {
      return { available: false, numberOfDays };
    }
  }

  // If none of the above conditions are met, the dates are available
  return { available: true, numberOfDays };
}

export function splitString(inputString) {
  const date = inputString.slice(0, 10);
  const dynamicString = inputString.slice(10 + "HaMa__".length);
  return { date, dynamicString };
}

export async function checkNumberOfNights(accommodationId, numberOfNights) {
  const accommodation = await accommodationModel.findById(accommodationId);
  const minimumNumberOfNights = accommodation.minimumNumberOfNights;
  if (minimumNumberOfNights > numberOfNights) {
    return { available: false, minimumNumberOfNights };
  }
  return { available: true, minimumNumberOfNights };
}

export async function checkNumberOfGuests(accommodationId, numberOfGuests) {
  const accommodation = await accommodationModel.findById(accommodationId);
  const maximumNumberOfGuests = accommodation.numberOfGuests;
  if (maximumNumberOfGuests < numberOfGuests) {
    return { availableNumberOfGuests: false, maximumNumberOfGuests };
  }
  return { availableNumberOfGuests: true, maximumNumberOfGuests };
}

export async function userHasBookings(userId) {
  const checkUser = await bookingModel.findOne({ userId });
  return Boolean(checkUser);
}
export async function addNewBooking(
  userId,
  checkIn,
  checkOut,
  numberOfGuests,
  numberOfDays,
  accommodationId
) {
  const accommodationData = await getAccommodationData(accommodationId);
  const booking = await bookingModel.findOne({ userId });
  booking.checkIn.push(checkIn);
  booking.checkOut.push(checkOut);
  booking.numberOfGuests.push(numberOfGuests);
  booking.numberOfNights.push(numberOfDays);
  booking.totlaPriceForAllNights.push(
    accommodationData.pricePerNight * numberOfDays
  );
  booking.bookings.push(accommodationId);
  await booking.save();
  return true;
}
export async function getAccommodationData(id) {
  const accommodation = await accommodationModel.findOne({
    _id: id,
    published: "Accepted",
    status: "Active",
  });
  return accommodation;
}

export async function hasUserAnyBookings(userId) {
  const checkUser = await bookingModel.findOne({ userId });
  return Boolean(checkUser);
}

export async function hasUserPermissionToDeleteBooking(bookingId, userId) {
  const getBooking = await bookingModel.findById({ _id: bookingId });
  if (getBooking.userId.equals(userId)) {
    return true;
  }
  return false;
}

export async function hasUserThisAccommodationToDeleteBooking(accommodationId, userId) {
  const getUserAccommodation = await bookingModel.findOne({ userId });
  for (let i = 0; getUserAccommodation.bookings.length; i++) {
    if (getUserAccommodation.bookings[i] == accommodationId) return true;
  }
  return false;
}
