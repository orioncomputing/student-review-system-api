/* 
   Copyright (c) 2017 Orion Computing LLC.
   Developed by Kian Moretz.
   This code is licensed under the terms of the MIT license.
   See the LICENSE file in the root of this project directory for license terms.
*/
(function() {
  "use strict";

  // Import user model
  const User = require("../models/user");

  // Import config
  const config = require("../config");

  // Import jwt
  const jwt = require("jsonwebtoken");

  const authedUser = async ctx => {
    if (!ctx.request.headers["authorization"]) return;
    const token = ctx.request.headers["authorization"].split(" ")[1];
    if (!token) return;
    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, config.secret);
    } catch (error) {
      return;
    }
    // Find user
    return await User.findOne({ email: decoded.email });
  };

  module.exports = authedUser;
})();
