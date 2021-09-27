const nodemailer = require("nodemailer");

module.exports = async (option) => {
    let transporter
    if (process.env.NODE_ENV === 'production'){
        transporter = nodemailer.createTransport({
            host: "smtp.sendgrid.net",
            port: "25",
            auth: {
                user: process.env.SENDGRID_USERNAME,
                pass: process.env.SENDGRID_PASSWORD
            }
        });
    }else{
        transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAIL_TEST_USER,
                pass: process.env.MAIL_TEST_PASSWORD
            },
            tls:{
                rejectUnauthorized:false
            }
        });
    }
    
    const mailOptions = {
        from: option.email,
        to: process.env.EMAIL,
        subject: option.subject,
        text: `name: ${option.name}, message: ${option.message}`
    };
    await transporter.sendMail(mailOptions);
}
