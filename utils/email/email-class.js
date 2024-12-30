const nodemailer = require("nodemailer");
class Email {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Boolean(process.env.SMTP_SECURE),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log(
      process.env.SMTP_HOST,
      process.env.SMTP_PORT,
      process.env.SMTP_SECURE,
      process.env.SMTP_USER,
      process.env.SMTP_PASS
    );
  }

  async sendEmail(email, subject, htmlContent) {
    try {
      console.log("I am sending email");
      const response = await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: subject,
        html: htmlContent,
      });
      console.log(`🚀 ~ file: email-class.js:31 ~ Email ~ response:`, response);
    } catch (error) {
      console.error("Email not sent!");
      console.error(error);
      throw error;
    }
  }
}

module.exports = { customEmailClass: new Email() };
