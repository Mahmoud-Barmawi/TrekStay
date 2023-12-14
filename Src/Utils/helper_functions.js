import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
import userModel from "../../Database/Models/user.model.js";

export async function isEmailAlreadyRegistered(email,next) {
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

export  function verifyToken(token) {
    const checkToken=jwt.verify(token,process.env.EMAILSECRET);
    return checkToken;
}

export async function isEmailConfirmed(email){
    const user = await userModel.findOne({ email });
    return Boolean(user.confirmEmail)
}
export async function passwordDecryption(email,password) {
    const user = await userModel.findOne({ email });
    const hashPassword = await bcrypt.compare(password, user.password);
    return Boolean(hashPassword);
}
export async function createToken(email){
    const user = await userModel.findOne({ email });
    const token=  jwt.sign({ id: user._id, role: user.role, status: user.status }, process.env.LOGINSECRET);
    return token;
}