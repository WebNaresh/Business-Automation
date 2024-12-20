const nodemailer = require("nodemailer");

module.exports = async (
  email,
  subject,
  htmlContent,
  options = {},
  user,
  token
) => {
  try {
    console.log(
      process.env.SMTP_HOST,
      process.env.SMTP_PORT,
      process.env.SMTP_SECURE,
      process.env.SMTP_USER,
      process.env.SMTP_PASS
    );
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
      to: email,
      subject: subject,
      html: htmlContent,
      // bcc: options.bcc || undefined,
    });
  } catch (error) {
    console.error("Email not sent!");
    console.error(error);
    throw error;
  }
};
