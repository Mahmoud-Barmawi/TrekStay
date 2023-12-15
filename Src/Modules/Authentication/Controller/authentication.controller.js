import userModel from './../../../../Database/Models/user.model.js';
import { uploadImage } from '../../../Utils/cloudinary_image_uploader.js';
import { isEmailAlreadyRegistered, generateEmailConfirmationToken, hashPassword, verifyToken, isEmailConfirmed, passwordDecryption, createToken, generateCode, checkValidCode } from '../../../Utils/helper_functions.js';
import { sendEmail } from '../../../Utils/email.js';

export const signUp = async (req, res, next) => {
    const { firstName, lastName, email, password, country, phoneNumber, sex } = req.body;
    if (await isEmailAlreadyRegistered(email)) {
        return next(new Error('Oops! Email Already Registered'));
    }
    const { secure_url, public_id } = await uploadImage(req.file.path, "profile");
    const emailToken = generateEmailConfirmationToken(email);
    await sendEmail(email, "Confirm Email", `<a href='${req.protocol}://${req.headers.host}/authentication/confirmEmail/${emailToken}'>Verify</a>`)
    const encryptedPassword = await hashPassword(password);
    const createUser = await userModel.create({ firstName, lastName, email, password: encryptedPassword, image: { secure_url, public_id }, country, phoneNumber, sex })
    return res.json({ message: "success", createUser });
}

export const updateConfirmEmail = async (req, res, next) => {
    const token = req.params.email;
    const decoded = verifyToken(token,process.env.EMAILSECRET);
    if (!token || !verifyToken(token,process.env.EMAILSECRET)) {
        return next(new Error('Cannot verify email... try again'));
    }
    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmEmail: false }, { confirmEmail: true });
    if (!user) return next(new Error('Something went wrong'));
    return next(new Error('Confirmed successfully'));
}

export const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    if (!await isEmailAlreadyRegistered(email)) {
        return next(new Error('Oops! There is an error in entering information '));
    }
    if (!await isEmailConfirmed(email)) {
        return next(new Error('Please Confirm your email'));
    }
    if (!await passwordDecryption(email, password)) {
        return next(new Error('Oops! There is an error in entering information '));
    }
    const token = await createToken(email);
    return res.json({ message: "success", token });
}

export const resetPasswordCode = async (req, res, next) => {
        const {email}=req.body;
        if(!await isEmailAlreadyRegistered(email))         
        return next(new Error('Oops! There is an error please check your email'));
        const code=generateCode();
        await userModel.findOneAndUpdate({email},{sendCode:code},{new:true});
        const html = `<h2> code is ${code}</h2>`;
        sendEmail(email,"Reset Password",html);
        return res.redirect(process.env.PAGE);
}

export const forgotPassword=async (req,res,next)=>{
    const {email,password,code}=req.body;
    if(!await isEmailAlreadyRegistered(email))         
        return next(new Error('Oops! There is an error please check your email'));
    if(!await checkValidCode(email,code))
        return next(new Error(`Invalid code`));
    const newPassword= await hashPassword(password);
    const updateUserData=await userModel.findOneAndUpdate({email},{password:newPassword,sendCode:null,passwordChangeTime:Date.now()},{new:true});
    return res.json({message:"password updated successfully",updateUserData});
}
