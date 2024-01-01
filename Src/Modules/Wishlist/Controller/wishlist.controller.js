import wishlistModle from "../../../../Database/Models/wishlist.model.js";
import { addAccommodationToWishlist, checkAccommodation, userHasWishlist } from "../../../Utils/helper_functions.js";

export const createWishlist = async (req, res, next) => {
    const { accommodationsId, wishlistName } = req.body;
    const checkUserWishlist = await userHasWishlist(req.user._id);
    if (checkUserWishlist) {
        const resultCheckAccommodation = await checkAccommodation(accommodationsId);
        if (resultCheckAccommodation) return next(new Error('This Accommodation Already Exist in Wishlist'));
        await addAccommodationToWishlist(accommodationsId,wishlistName,req.user._id);
        return res.json({message:"success"});
    }
    const createWishlistToUser=await wishlistModle.create({
        userId:req.user._id,
        wishlistName:[wishlistName],
        accommodations:[accommodationsId]
    })
    return res.json({message:"success",createWishlistToUser});
}
