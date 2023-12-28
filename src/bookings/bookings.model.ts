import { Schema, model, Model } from "mongoose";
import { IBooking, IPayment } from "./bookings.interface";
import { PackageSchema } from "../adventures/adventures.model";
import { PaymentMethodEnum } from "../common/config/enum";

const PaymentSchema = new Schema<IPayment>(
  {
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: PaymentMethodEnum,
      required: true,
    },
    pidx: {
      type: String,
    },
    paymentUrl: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "COMPLETED",
        "CANCELLED",
        "EXPIRED",
        "FAILED",
        "REFUNDED",
      ],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

const BookingSchema = new Schema<IBooking>(
  {
    adventure: {
      type: Schema.Types.ObjectId,
      ref: "Adventure",
      required: true,
    },
    package: PackageSchema,
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
      enum: ["NEW", "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
      default: "NEW",
    },
    payment: PaymentSchema,
  },
  {
    timestamps: true,
  }
);

const Booking: Model<IBooking> = model<IBooking>("Booking", BookingSchema);
export default Booking;
