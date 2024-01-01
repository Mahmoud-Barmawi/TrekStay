import mongoose, { Schema, Types, model } from "mongoose";

const wishlistSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    accommodations: [
        {
            type: Types.ObjectId,
            ref: 'Accommodation',
            required: true,
        }
    ],
    wishlistName:[ {
        type: String,
        required: true,
    }]
}, { timestamps: true });


const wishlistModle = mongoose.models.Wishlist || model('Wishlist', wishlistSchema);
export default wishlistModle;   

