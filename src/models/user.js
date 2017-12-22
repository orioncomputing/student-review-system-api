/* 
   Copyright (c) 2017 Orion Computing LLC.
   Developed by Kian Moretz.
   This code is licensed under the terms of the MIT license.
   See the LICENSE file in the root of this project directory for license terms.
*/
(function() {
  "use strict";

  // Require Mongoose
  const mongoose = require("mongoose");

  // Create a model
  const userModel = mongoose.model("User", {
    email: String,
    password: String,
    // User's name (display name)
    name: String,
    isAdmin: Boolean,
    // Details for resetting passwords
    passwordResetToken: String,
    passwordResetExpires: Date,
    // For confirming emails during signup
    confirmationToken: String
  });

  module.exports = userModel;
})();
