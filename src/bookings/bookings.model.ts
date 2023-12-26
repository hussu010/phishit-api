import { Schema, model, Model } from "mongoose";
import { IBooking } from "./bookings.interface";

const BookingSchema = new Schema<IBooking>(
  {
    adventure: {
      type: Schema.Types.ObjectId,
      ref: "Adventure",
      required: true,
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    guide: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    noOfPeople: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

const Booking: Model<IBooking> = model<IBooking>("Booking", BookingSchema);
export default Booking;
