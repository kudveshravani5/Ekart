import nodemailer from "nodemailer";
import "dotenv/config";

export const verifyEmail = async (token, email) => {
  try {
    console.log("MAIL_USER:", process.env.MAIL_USER);
    console.log("MAIL_PASS exists:", !!process.env.MAIL_PASS);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // 🔥 MUST BE APP PASSWORD
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Email Verification",
      text: `
Hi,

Please verify your email by clicking the link below:

https://ekart-kudveshravani5s-projects.vercel.app/verify/${token}

Thanks
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email Sent Successfully");
    console.log("Info:", info.response);

  } catch (error) {
    console.log("❌ FULL EMAIL ERROR:");
    console.log(error);
  }
};