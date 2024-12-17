const nodemailer = require("nodemailer");

module.exports = async (email, subject, htmlContent, options = {}, user, token) => {
  try {
    console.log(
      process.env.HOST,
      process.env.EMAIL_PORT,
      process.env.SECURE,
      process.env.USEREMAIL,
      process.env.PASS
    );
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

