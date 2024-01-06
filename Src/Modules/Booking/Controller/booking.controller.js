import { checkAvailability, checkNumberOfGuests, checkNumberOfNights } from "../../../Utils/helper_functions.js";

export const bookingAccommodation = async (req, res, next) => {
    const { id } = req.params;
    const { checkIn, checkOut, numberOfGuests } = req.body;

    const resultAvailability = await checkAvailability(id, checkIn, checkOut);
    if (!resultAvailability.available)
        return next(new Error(`The requested booking period is not available`));

    const { available, minimumNumberOfNights } = await checkNumberOfNights(id, resultAvailability.numberOfDays);
    if (!available)
        return next(new Error(`This accommodation requires a minimum booking of ${minimumNumberOfNights} nights`));

    const { availableNumberOfGuests, maximumNumberOfGuests } = await checkNumberOfGuests(id, numberOfGuests);
    if (!availableNumberOfGuests)
        return next(new Error(`This accommodation can only accommodate a maximum of ${maximumNumberOfGuests} individuals`));

    // check if user has a booking, and if not make one if yes add data to array
    return res.json(numberOfGuests);
}




