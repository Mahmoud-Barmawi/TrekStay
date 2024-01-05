import mongoose, { Schema, Types, model } from "mongoose";
const bookingSchema=new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    checkIn:[{
        type:Date,
        required:true,
    }],
    checkOut:[{
        type:Date,
        required:true,
    }],
    numberOfNights:[{
        type:Number,
        required:true,
    }],
    numberOfGuests:[{
        type:Number,
        required:true,
    }],
    totlaPriceForAllNights:[{
        type:Number,
        required:true,
    }],
    bookings:[{
            type:Types.ObjectId,
            ref:'Accommodation',
            required:true,
    }]
},{
    timestamps:true,
})

const bookingModel=mongoose.models.Accommodation || model('Booking',bookingSchema);
export default bookingModel;