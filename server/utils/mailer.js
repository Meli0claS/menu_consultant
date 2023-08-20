require('dotenv').config()
const nodeMailer = require('nodemailer');

const sendEmail = async (to, subject, otp) => {
    try {
        const transport = nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });

        const options = {
            from: process.env.MAIL_FROM_ADDRESS,
            to: to,
            subject: subject,
            text: otp
        }

        return await transport.sendMail(options);
    } catch (error) {
        console.log(error);
        return false;
    }

}

module.exports = sendEmail;

