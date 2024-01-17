import axios from "axios";

import { IBooking } from "./bookings.interface";
import { CustomError } from "../common/interfaces/common";

const initiateKhaltiPaymentRequest = async ({
  booking,
  redirectUrl,
}: {
  booking: IBooking;
  redirectUrl: string;
}): Promise<{
  pidx: string;
  paymentUrl: string;
  expiresAt: Date;
}> => {
  try {
    const config = {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      {
        amount: booking.package.price * 100,
        purchase_order_id: booking._id,
        purchase_order_name: `${booking.adventure.title} - ${booking.package.title}`,
        website_url: redirectUrl,
        return_url: redirectUrl,
      },
      config
    );

    return {
      pidx: response.data.pidx,
      paymentUrl: response.data.payment_url,
      expiresAt: response.data.expires_at,
    };
  } catch (error: any) {
    throw new CustomError(error.message, 503);
  }
};

const lookupKhaltiPayment = async ({
  pidx,
}: {
  pidx: string;
}): Promise<{
  pidx: string;
  total_amount: number;
  status: string;
  transaction_id: string;
}> => {
  try {
    const config = {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      {
        pidx,
      },
      config
    );

    return {
      pidx: response.data.pidx,
      total_amount: response.data.total_amount,
      status: response.data.status,
      transaction_id: response.data.transaction_id,
    };
  } catch (error: any) {
    throw new CustomError(error.message, 503);
  }
};

export { initiateKhaltiPaymentRequest, lookupKhaltiPayment };
