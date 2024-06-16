import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: process.env.NODE_ENV === 'production',
    auth: {
      user: 'rakiib010@gmail.com',
      pass: 'igkm lexx acji wtzg',
    },
  });

  await transporter.sendMail({
    from: 'rakiib010@gmail.com', // sender address
    to, // list of receivers
    subject: 'Change password', // Subject line
    text: 'Reset your password within 10 min', // plain text body
    html, // html body
  });
};
