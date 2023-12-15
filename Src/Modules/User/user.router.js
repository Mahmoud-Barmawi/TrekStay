import {Router} from "express"
import * as userController from './Controller/user.controller.js'
import { auth, roles } from "../../Middleware/authentication.js";
const router=Router();

router.patch('/editPassword',auth([roles.USER,roles.ADMIN]),userController.editPassword);

export default router;