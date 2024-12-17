const nodemailer = require("nodemailer");

const sendEmailMegha = async ({ from, to, cc, bcc, subject, html }) => {
  console.log({ from, to, cc, bcc, subject, html });
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USEREMAIL,
        pass: process.env.PASS,
      },
    });
    const info = await transporter.sendMail({
      from: process.env.USEREMAIL,
      to: to,
      subject: subject,
      html: html,
    });
    console.log("info", info);
  } catch (error) {
    console.error("Email not sent!");
    console.error(error);
    throw error;
  }
};

module.exports = { sendEmailMegha };
