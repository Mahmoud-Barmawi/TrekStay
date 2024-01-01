import { Router } from "express";
import * as wishlistController from './Controller/wishlist.controller.js';
import { auth, roles } from "../../Middleware/authentication.js";
const router=Router();

router.post('/CreateWishlist',auth(roles.USER),wishlistController.createWishlist);

export default router;