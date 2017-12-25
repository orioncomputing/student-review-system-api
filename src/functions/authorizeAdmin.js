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

  // Create function
  const authorizeAdmin = async ctx => {
    // Grab token from header
    if (!ctx.request.headers["authorization"]) return false;
    const token = ctx.request.headers["authorization"].split(" ")[1];
    if (!token) return false;
    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, config.secret);
    } catch (error) {
      return false;
    }
    // Find user and check for admin privileges
    const user = await User.findOne({ email: decoded.email });
    if (!user) return false;
    if (user.isAdmin) return user;
    return false;
  };

  module.exports = authorizeAdmin;
})();
