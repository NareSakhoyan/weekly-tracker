const nodemailer = require("nodemailer");
const { EMAIL_USERNAME, EMAIL_PASSWORD } = require("../configs");

const sendEmail = (email, link) => {
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "nare.optimumpartners@gmail.com",
    to: ["nare.sakhoyan@gmail.com"],
    subject: "OP test",
    html: `<h2 style="color:#ff6600;">Please open the link to vreify your account at weekly tracker! ${link}</h2>`,
  };

  //   let transporter = nodemailer.createTransport({
  //     host: "smtp.gmail.com",
  //     port: 465,
  //     secure: true,
  //     auth: {
  //       type: "OAuth2",
  //       user: "nare.optimumpartners@gmail.com",
  //     },
  //   });

  //   transporter.set("oauth2_provision_cb", (user, renew, callback) => {
  //     let accessToken = userTokens[user];
  //     if (!accessToken) {
  //       return callback(new Error("Unknown user"));
  //     } else {
  //       return callback(null, accessToken);
  //     }
  //   });

  transport.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = { sendEmail };
