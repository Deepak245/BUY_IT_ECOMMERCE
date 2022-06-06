const nodemailer = require('nodemailer');

//the options we are seding are coming forget passed in authController try block of send email await function.
// that function is declared as await as its async code so async defined to send email function.
//cope the code from mailtraper
// place all the constants from config file.
const sendEmail = async (options)=>{

    const transport = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMPT_PORT,
        auth: {
          user: process.env.MAILTRAP_USERID,
          pass: process.env.MAILTRAP_PASSWORD
        }
      });
      const message = {
          from:`${process.env.MAILTRAP_FROM_NAME}<${process.env.MAILTRAP_FROM_EMAIL}>`,
          to:options.email,
          subject:options.subject,
          text:options.message
      }

      await transport.sendMail(message);
}

module.exports = sendEmail;