import { Router } from "express";
import * as wishlistController from './Controller/wishlist.controller.js';
import { auth, roles } from "../../Middleware/authentication.js";
import { asyncHandler } from "../../Utils/global_error_handling.js";
const router=Router();

router.post('/CreateWishlist',auth(roles.USER),asyncHandler(wishlistController.createWishlist));
router.patch('/EditWishlistName/:id',auth(roles.USER),asyncHandler(wishlistController.updateWishlistName));
router.delete('/DeleteAccommodationFromWishlist/:id/:accommodationsId',auth(roles.USER),asyncHandler(wishlistController.deleteAccommodationFromWishlist));
router.delete('/DeleteWishlistNameFromWishlist/:id',auth(roles.USER),asyncHandler(wishlistController.deleteWishlistNameFromWishlist));
router.get('/GetWishlist',auth(roles.USER),asyncHandler(wishlistController.getWishlist));
export default router;