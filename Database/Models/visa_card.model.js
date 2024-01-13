import mongoose, { Schema, Types, model } from "mongoose";
const visaSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    cardNumber: {
        type: Number,
        required: true,
    },
    cardPassword: {
        type: String,
        required: true,
    },
    amountOfMoney: {
        type: String,
        required: true,
        default: "5000",
    }
}, {
    timestamps: true,
})

const visaModel = mongoose.models.Visa || model("Visa", visaSchema);
export default visaModel;

