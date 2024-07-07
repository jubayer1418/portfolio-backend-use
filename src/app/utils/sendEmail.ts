import nodeMailer, { createTransport } from "nodemailer";
export const sendEmail = async (options:any) => {
  if (!process.env.SMPT_HOST ||!process.env.SMPT_PORT ||!process.env.SMPT_SERVICE ||!process.env.SMPT_MAIL ||!process.env.SMPT_PASSWORD) {
    throw new Error("Missing SMTP configuration");
  }
  if (!options.email ||!options.subject ||!options.message) {
    throw new Error("Missing email, subject, or message");
  }
  // create reusable transporter object using the default SMTP transport
  // replace below credentials with your own
  const transporter = createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'your_email', // generated ethereal user
      pass: 'your_password', // generated ethereal password
    },
  });
  // const transporter = nodeMailer.createTransport({
  //   host : process.env.SMPT_HOST ,
  //   port: process.env.SMPT_PORT,
  //   service: process.env.SMPT_SERVICE,
  //   auth: {
  //     user: process.env.SMPT_MAIL,
  //     pass: process.env.SMPT_PASSWORD,
  //   },
  // });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};
