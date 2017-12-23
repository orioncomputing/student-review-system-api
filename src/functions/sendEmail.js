/* 
   Copyright (c) 2017 Orion Computing LLC.
   Developed by Kian Moretz.
   This code is licensed under the terms of the MIT license.
   See the LICENSE file in the root of this project directory for license terms.
*/
(function() {
  "use strict";

  // Import configuration
  const config = require("../config");

  // Import nodemailer
  const nodemailer = require("nodemailer");
  const directTransport = require("nodemailer-direct-transport");

  // Setup nodemailer
  const transporter = nodemailer.createTransport(
    directTransport({ name: config.emailConfig.hostname })
  );

  const sendEmail = async (to, subject, message) => {
    console.log(to, subject, message);
    try {
      const message = {
        from: config.emailConfig.from,
        to: to,
        subject: subject,
        text: message
      };

      await transporter.sendMail(message);
      return true;
    } catch (err) {
      return err;
    }
  };

  module.exports = sendEmail;
})();
