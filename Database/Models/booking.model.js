import mongoose, { Schema, Types, model } from "mongoose";
const bookingSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    checkIn: [
      {
        type: Date,
        required: true,
      },
    ],
    checkOut: [
      {
        type: Date,
        required: true,
      },
    ],
    numberOfNights: [
      {
        type: String,
        required: true,
      },
    ],
    numberOfGuests: [
      {
        type: String,
        required: true,
      },
    ],
    totlaPriceForAllNights: [
      {
        type: String,
        required: true,
      },
    ],
    bookings: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const bookingModel = mongoose.models.Booking || model("Booking", bookingSchema);
export default bookingModel;