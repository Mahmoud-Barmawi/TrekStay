import wishlistModle from "../../../../Database/Models/wishlist.model.js";
import { addAccommodationToWishlist, checkAccommodation, hasUserWishlist, isWishlistAlreadyExist, isWishlistWithNamePresent, userHasWishlist } from "../../../Utils/helper_functions.js";

export const createWishlist = async (req, res, next) => {
    const { accommodationsId, wishlistName } = req.body;
    const checkUserWishlist = await userHasWishlist(req.user._id);
    if (checkUserWishlist) {
        const resultCheckAccommodation = await checkAccommodation(accommodationsId);
        if (resultCheckAccommodation) return next(new Error('This Accommodation Already Exist in Wishlist'));
        await addAccommodationToWishlist(accommodationsId, wishlistName, req.user._id);
        return res.json({ message: "success" });
    }
    const createWishlistToUser = await wishlistModle.create({
        userId: req.user._id,
        wishlistName: [wishlistName.toLowerCase()],
        accommodations: [accommodationsId]
    })
    return res.json({ message: "success", createWishlistToUser });
}
export const updateWishlistName = async (req, res, next) => {
    const { id } = req.params;
    const { oldName, newName } = req.body;

    const isWishlistExist = await isWishlistAlreadyExist(id);
    if (!isWishlistExist)
        return next(new Error('Sorry, but the specified wishlist cannot be found'));

    const alterUserAccessibility = await hasUserWishlist(id, req.user._id);
    if (!alterUserAccessibility)
        return next(new Error('You lack the authorization to modify this wishlist'));

    const isWishlistNameExist = await isWishlistWithNamePresent(oldName.toLowerCase());
    if (!isWishlistNameExist)
        return next(new Error(`You do not have any wishlist with the name ${oldName}`));

    const wishlistUpdated = await wishlistModle.findById(id);

    wishlistUpdated.wishlistName = wishlistUpdated.wishlistName.map(name => (name === oldName.toLowerCase() ? newName.toLowerCase() : name));

    await wishlistUpdated.save();
    return res.json({ message: "success", wishlistUpdated });
}
export const deleteAccommodationFromWishlist = async (req, res, next) => {
    const { id, accommodationsId } = req.params;

    const isWishlistExist = await isWishlistAlreadyExist(id);
    if (!isWishlistExist)
        return next(new Error('Sorry, but the specified wishlist cannot be found'));

    const alterUserAccessibility = await hasUserWishlist(id, req.user._id);
    if (!alterUserAccessibility)
        return next(new Error('You lack the authorization to modify this wishlist'));

    const resultCheckAccommodation = await checkAccommodation(accommodationsId);
    if (!resultCheckAccommodation)
        return next(new Error('This Accommodation Does Not Exist in Wishlist'));

    const deleteAccommodation = await wishlistModle.findById(id);

    for (let i = deleteAccommodation.accommodations.length - 1; i >= 0; i--) {
        if (deleteAccommodation.accommodations[i].equals(accommodationsId)) {
            deleteAccommodation.accommodations.splice(i, 1);
            deleteAccommodation.wishlistName.splice(i, 1);
        }
    }

    await deleteAccommodation.save();
    return res.json({ message: "success", deleteAccommodation });

}
export const deleteWishlistNameFromWishlist = async (req, res, next) => {
    const { id } = req.params;
    const { wishlistName } = req.body;
    const isWishlistExist = await isWishlistAlreadyExist(id);
    if (!isWishlistExist)
        return next(new Error('Sorry, but the specified wishlist cannot be found'));

    const alterUserAccessibility = await hasUserWishlist(id, req.user._id);
    if (!alterUserAccessibility)
        return next(new Error('You lack the authorization to modify this wishlist'));

    const isWishlistNameExist = await isWishlistWithNamePresent(wishlistName.toLowerCase());
    if (!isWishlistNameExist)
        return next(new Error(`You do not have any wishlist with the name ${wishlistName}`));

    const deleteWishlistName = await wishlistModle.findById(id);

    for (let i = deleteWishlistName.wishlistName.length - 1; i >= 0; i--) {
        if (deleteWishlistName.wishlistName[i] === wishlistName.toLowerCase()) {
            deleteWishlistName.wishlistName.splice(i, 1);
            deleteWishlistName.accommodations.splice(i, 1);
        }
    }

    await deleteWishlistName.save();
    return res.json({ message: "success", deleteWishlistName });
}
export const getWishlist = async (req, res, next) => {
    const checkUserWishlist = await userHasWishlist(req.user._id);
    if (!checkUserWishlist) {
        return res.json({ message: "You dont have any wishlist" });
    }
    const getWishlist = await wishlistModle.findOne({ userId: req.user._id });

    const organizedData = getWishlist.wishlistName.reduce((acc, wishlistName, index) => {
        if (!acc[wishlistName]) {
            acc[wishlistName] = {
                wishlistName,
                accommodations: [],
            };
        }
        acc[wishlistName].accommodations.push(getWishlist.accommodations[index]);
        return acc;
    }, {});
    const organizedArray = Object.values(organizedData);
    return res.json({ message: "success", organizedWishlistLength: organizedArray.length ,organizedWishlistData: organizedArray});
}