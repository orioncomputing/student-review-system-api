/* 
   Copyright (c) 2017 Orion Computing LLC.
   Developed by Kian Moretz.
   This code is licensed under the terms of the MIT license.
   See the LICENSE file in the root of this project directory for license terms.
*/
(function() {
  "use strict";

  // Import user model
  const User = require("../../../models/user");

  // Import config
  const config = require("../../../config");

  // Import bcrypt and jwt
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");

  // Create route
  const authenticate = async ctx => {
    try {
      // Fail if parameters are missing
      if (
        !ctx.request.body ||
        !ctx.request.body.email ||
        !ctx.request.body.password
      ) {
        ctx.response.status = 400;
        return (ctx.response.body = {
          success: false,
          message: "Missing required parameter"
        });
      }
      // Find user
      var user = await User.findOne({
        email: ctx.request.body.email
      });
      // Throw 401 if no user
      if (!user) {
        ctx.response.status = 401;
        return (ctx.response.body = {
          success: false,
          message: "User not found"
        });
      }
      // Check password
      const result = await bcrypt.compare(
        ctx.request.body.password,
        user.password
      );
      if (result) {
        // Sign JWT
        const token = jwt.sign(
          { email: user.email, username: user.username, _id: user._id },
          config.secret,
          {
            expiresIn: 86400 // expires in 24 hours
          }
        );
        // And send it
        ctx.response.status = 200;
        return (ctx.response.body = {
          success: true,
          token: token
        });
        // Fail if password does not match
      } else {
        ctx.response.status = 401;
        return (ctx.response.body = {
          success: false,
          token: "Incorrect password"
        });
      }
    } catch (error) {
      // Send 500 error
      ctx.response.status = 500;
      return (ctx.response.body = {
        success: false,
        message: "Internal server error"
      });
    }
  };

  module.exports = authenticate;
})();
