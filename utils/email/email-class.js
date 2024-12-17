const nodemailer = require("nodemailer");
class Email {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USEREMAIL,
        pass: process.env.PASS,
      },
    });
    console.log(
      process.env.HOST,
      process.env.EMAIL_PORT,
      process.env.SECURE,
      process.env.USEREMAIL,
      process.env.PASS
    );
  }

  async sendEmail(email, subject, htmlContent) {
    try {
      console.log("I am sending email");
      const response = await this.transporter.sendMail({
        from: process.env.USEREMAIL,
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
