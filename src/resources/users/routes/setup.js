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

  // Import bcrypt
  const bcrypt = require("bcryptjs");

  // Create route
  const setup = async ctx => {
    try {
      // Fail if parameters are missing
      if (
        !ctx.request.body ||
        !ctx.request.body.email ||
        !ctx.request.body.password ||
        !ctx.request.body.name
      ) {
        ctx.response.status = 400;
        return (ctx.response.body = {
          success: false,
          message: "Missing required parameter"
        });
      }
      // Fail if email is invalid
      if (!config.emailRegex.test(ctx.request.body.email)) {
        ctx.response.status = 400;
        return (ctx.response.body = {
          success: false,
          message: "Invalid email address"
        });
      }
      // Fail if password is invalid
      if (
        ctx.request.body.password.length > 64 ||
        ctx.request.body.password.length < 8
      ) {
        ctx.response.status = 400;
        return (ctx.response.body = {
          success: false,
          message: "Password must be 8 to 64 characters in length"
        });
      }
      // Fail if user already exists
      const user = await User.findOne();
      if (user) {
        ctx.response.status = 403;
        return (ctx.response.body = {
          success: false,
          message: "An account already exists"
        });
      }
      // Hash password
      const hashedPassword = await bcrypt.hash(ctx.request.body.password, 10);
      // Create and save user
      const newUser = new User({
        name: ctx.request.body.name,
        username: ctx.request.body.username,
        email: ctx.request.body.email,
        password: hashedPassword,
        isAdmin: true
      });
      await newUser.save();
      // Send success response
      ctx.response.status = 201;
      return (ctx.response.body = {
        success: true,
        user: {
          name: newUser.name,
          email: newUser.email,
          isAdmin: newUser.isAdmin
        }
      });
    } catch (error) {
      // Send 500 error
      ctx.response.status = 500;
      return (ctx.response.body = {
        success: false,
        message: "Internal server error"
      });
    }
  };

  module.exports = setup;
})();
