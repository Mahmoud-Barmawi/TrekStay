import mongoose, { Schema, model } from "mongoose";
const userSchema = new Schema({
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
        type: Object
    },
    country: {
        type: String,
        required: true,
    },
    sex: {
        type: String,
        enum: ['Male', 'Femail'],
        required: true,
    },
    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Inactive'],
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin']
    },
    sendCode: {
        type: String,
        default: null,
    },
    passwordChangeTime: {
        type: Date,
    },
    emergencyContact: {
        type: [{
            name: { type: String, required: true },
            Relationship: { type: String, required: true },
            yourColleaguesEmail: {
                type: String,
                required: true,
                unique: true,
            },
            phoneNumber: { type: String, required: true },
        }],
        required:true,
    },
}, {
    timestamps: true,
})
const userModel = mongoose.models.User || model('User', userSchema);
export default userModel;