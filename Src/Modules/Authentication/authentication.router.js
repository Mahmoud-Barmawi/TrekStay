import { Router } from "express";
import * as authenticationController from './Controller/authentication.controller.js';
const router=Router();

router.post('/sign-up',authenticationController.signUp);

export default router;