const nodemailer = require("nodemailer");

module.exports = async (option) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.mailgun.org",
        port: "25",
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    
    
    const mailOptions = {
        from: option.email,
        to: process.env.EMAIL,
        subject: option.subject,
        text: `name: ${option.name}, message: ${option.message}`
    };
    await transporter.sendMail(mailOptions);
}
