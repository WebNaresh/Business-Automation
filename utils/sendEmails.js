const nodemailer = require("nodemailer");

const sendEmailMegha = async ({ from, to, cc, bcc, subject, html }) => {
  console.log({ from, to, cc, bcc, subject, html });
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Boolean(process.env.SMTP_SECURE),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
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
