import mongoose, { Schema, model } from "mongoose";
import { roles } from "../../Src/Middleware/authentication.js";

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        confirmEmail: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        image: {
            required: true,
            type: Object,
        },
        country: {
            type: String,
            required: true,
        },
        sex: {
            type: String,
            enum: ['Male', 'Female'], // Corrected the enum value for 'Female'
            required: true,
        },
        status: {
            type: String,
            default: 'Active',
            enum: ['Active', 'Inactive'],
        },
        role: {
            type: String,
            default: roles.USER,
            enum: Object.values(roles),
        },
        sendCode: {
            type: String,
            default: null,
        },
        passwordChangeTime: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const userModel = mongoose.models.User || model('User', userSchema);

export default userModel;
