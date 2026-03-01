import nodemailer from "nodemailer";
import "dotenv/config";
export const verifyEmail = (token, email) => {
  console.log("MAIL_USER:", process.env.MAIL_USER);
  console.log("MAIL_PASS exists:", !!process.env.MAIL_PASS);
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  
  const mailConfigurations = {
    // It should be a string of sender/server email
    from: process.env.MAIL_USER,
    to: email,

    // Subject of Email
    subject: "Email Verification",

    // This would be the text of email body
    text: `Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email
           http://localhost:5173/verify/${token} 
           Thanks`,
  };
  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) {
      console.log("❌ EMAIL ERROR:", error.message); // 👈 change this also
      return;
    }
    console.log("Email Sent Successfully");
    console.log(info);
  });
};
