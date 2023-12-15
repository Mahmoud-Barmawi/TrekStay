import { checkBearerKey, checkchangePasswordTime, splitToken, userRole, verifyToken } from "../Utils/helper_functions.js";
import userModel from "../../Database/Models/user.model.js";

export const roles = {
    USER: 'User',
    ADMIN: 'Admin',
};

export const auth = (Roles = []) => {
    return async (req, res, next) => {
        const { authorization } = req.headers;
        if (!checkBearerKey(authorization)) return next(new Error('Invalid Token'));
        const token = splitToken(authorization);
        const tokenVerfied = verifyToken(token[1], process.env.LOGINSECRET)
        if (!tokenVerfied) return next(new Error('Invalid Token'));
        const user = await userModel.findById(tokenVerfied.id).select('role changePasswordTime');
        if (!user) return next(new Error('Not registered user'));
        if (checkchangePasswordTime(user, tokenVerfied)) return next(new Error('Expired token, please Sign in again'));
        if (!userRole(Roles, user)) return next(new Error('Access to this page is restricted and permission is not granted'));
        req.user = user;
        next();
    }
}