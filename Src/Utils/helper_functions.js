import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
import userModel from "../../Database/Models/user.model.js";
import { customAlphabet } from "nanoid";
import categoryModel from "../../Database/Models/category.model.js";
import accommodationModel from "../../Database/Models/accommodation.model.js";

export async function isEmailAlreadyRegistered(email) {
    const checkEmail = await userModel.findOne({ email });
    return Boolean(checkEmail);
}

export function generateEmailConfirmationToken(email) {
    return jwt.sign({ email }, process.env.EMAILSECRET);
}

export async function hashPassword(password) {
    const hashPassword = await bcrypt.hash(password, parseInt(process.env.SALTROUND));
    return hashPassword;
}

export function verifyToken(token, dotenvVariable) {
    const checkToken = jwt.verify(token, dotenvVariable);
    return checkToken;
}

export async function isEmailConfirmed(email) {
    const user = await userModel.findOne({ email });
    return Boolean(user.confirmEmail)
}

export async function passwordDecryption(email, password) {
    const user = await userModel.findOne({ email });
    const hashPassword = await bcrypt.compare(password, user.password);
    return Boolean(hashPassword);
}

export async function createToken(email) {
    const user = await userModel.findOne({ email });
    const token = jwt.sign({ id: user._id, role: user.role, status: user.status }, process.env.LOGINSECRET);
    return token;
}

export function generateCode() {
    let code = customAlphabet('123456789abcdzABCDZ', 6)
    return code = code();
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
    if(parseInt(user.passwordChangeTime?.getTime()/1000)>tokenVerfied.iat)
        return true;
    return false;

}
export function userRole(Roles,user) {
    if(Roles.includes(user.role)) return true;
    return false;
}

export async function isCategoryAlreadyExist(categoryName) {
    const checkCategory = await categoryModel.findOne({ name: categoryName.toLowerCase() });
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
export async function verifyUserAccommodationCompatibility(accommodation_id,user_id){
    const accommodationCreatedBy=await accommodationModel.findById(accommodation_id);
    if(accommodationCreatedBy.createdBy.equals(user_id)) return true;
    return false;
}