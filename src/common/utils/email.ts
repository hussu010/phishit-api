import nodemailer from "nodemailer";
import { IUser } from "../../users/users.interface";

const sendEmail = async ({
  from,
  to,
  subject,
  html,
}: {
  from: string;
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      html: html,
    });
  } catch (error) {
    throw error;
  }
};

const sendGuideRequestUpdateEmail = async ({
  status,
  user,
}: {
  status: string;
  user: IUser;
}) => {
  try {
    await sendEmail({
      from: '"Phish.it 👻"',
      to: user.email,
      subject: `Your guide request has been ${status}`,
      html: `
      <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Guide Request Update</title>
            </head>
            <body>
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
                    <h2 style="color: #333;">Guide Request Update</h2>
                    <p>Hello ${user.username},</p>
                    <p>Your guide request has been ${status}.</p>
                    <p>Email: ${user.email}</p>
                    <p>Thank you for using our service.</p>
                    <p>Phish.it Team</p>
                </div>
            </body>
        </html>
      `,
    });
  } catch (error) {
    throw error;
  }
};

export { sendEmail, sendGuideRequestUpdateEmail };
