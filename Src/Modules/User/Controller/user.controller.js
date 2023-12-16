import userModel from "../../../../Database/Models/user.model.js";
import { hashPassword, passwordDecryption } from "../../../Utils/helper_functions.js";

export const editPassword= async (req,res,next)=>{
    const {oldPaasword,newPassword}=req.body;
    const user=req.user;
    const getUserData=await userModel.findById(user._id);
    if(!passwordDecryption(getUserData.email,oldPaasword)) return next(new Error("Incorrect Old Password"));
    const hashNewPassword=await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(req.user._id,{password:hashNewPassword,passwordChangeTime:Date.now()});
    return res.json({message:"password updated successfully"});
}

export const test=(req,res)=>{
    return res.json("sss");
}