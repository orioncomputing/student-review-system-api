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

  const sendEmail = async (to, subject, message) => {
    try {
      const messageObject = {
        from: config.emailConfig.from,
        to: to,
        subject: subject,
        text: message
      };
      console.log(message);
      return true;
    } catch (err) {
      return err;
    }
  };

  module.exports = sendEmail;
})();
