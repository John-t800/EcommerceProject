const dotenv = require('dotenv');
dotenv.config();

const nodeMailer = (email,subject,htmlContent)=>{
  const nodeMailer = require('nodemailer');
  const adminEmail = `${process.env.adminEmail}`;
  const adminPass = `${process.env.adminPass}`;
  const mailHost = `${process.env.mailHost}`;
  const mailPort = `${process.env.mailPort}`;

  const transporter = nodeMailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false,
    auth:{
      user: adminEmail,
      pass: adminPass
    }
  });

  const options = {
    from: adminEmail,
    to: email,
    subject: subject,
    html: htmlContent
  }

  return transporter.sendMail(options);
};

const utils = {
  sendMail: async (req,res) => {
    try{
      const {email,subject,htmlContent} = req.body;
      await nodeMailer(email,subject,htmlContent);
      console.log('SEND MESSAGE SUCCESS');
    }catch(e){
      console.log(e);
    }
  }
}

module.exports = utils;
