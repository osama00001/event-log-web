import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL_HOST,
    pass: process.env.APP_PASSWORD,
  },
});



const sendMail = async (mailOptions) => {
  try {
    const response = await transporter.sendMail(mailOptions);
   return response
  } catch (err) {
    console.warn("this is error:",err)
  }
};
export default sendMail
