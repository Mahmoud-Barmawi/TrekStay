import { checkAvailability } from "../../../Utils/helper_functions.js";

export const bookingAccommodation = async (req, res, next) => {
    const { id } = req.params;
    const { checkIn, checkOut, numberOfNights, numberOfGuests } = req.body;
    const result=await checkAvailability(id,checkIn, checkOut);
    if(!result) 
        return next(new Error(`The requested booking period is not available`));
    return res.json(result);
}




