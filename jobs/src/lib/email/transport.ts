import nodemailer from 'nodemailer';

export default nodemailer.createTransport({
        host:process.env.EMAIL_SERVICE,
        port: Number(process.env.EMAIL_PORT) || 465,
        secure: true,
        requireTLS: true,
        
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
});

