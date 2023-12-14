import nodemailer from "nodemailer";
export async function sendEmail(to, subject, html) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER,
            pass:process.env.PASS 
        },
    });

    const info = await transporter.sendMail({
        from: '"TrekStay" <TrekStay@info.com>', 
        to,
        subject,
        html
    });
    return info;
}

