/* 
   Copyright (c) 2017 Orion Computing LLC.
   Developed by Kian Moretz.
   This code is licensed under the terms of the MIT license.
   See the LICENSE file in the root of this project directory for license terms.
*/
(function() {
  "use strict";

  module.exports = {
    // Connection string for database
    dbString: "mongodb://mongo/studentreview",
    // Regular expression for testing emails
    emailRegex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    // Secret used for signing JWTs
    secret: "jwt-signing-secret-12345",
    // Configuration for email sending
    emailConfig: {
      // This should be changed for production usage.
      hostname: "example.com",
      from: "noreply@example.com"
    },
    // The URL for the current instance of the application. Change this in production usage.
    // Note: Include the URL prefix (http or https://) and do not include a "/" at the end.
    url: "http://example.com",
    // Email messages
    messages: {
      accountSetup: {
        subject: "Set up your account on the Student Review System",
        message:
          "You've been invited by $invitername to set up an account on the Student Review System. If you believe this was a mistake, please ignore this email. To set up your account, follow this link: $link"
      }
    }
  };
})();
