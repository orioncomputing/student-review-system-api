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

  // Import admin authorization
  const authorizeAdmin = require("../../../functions/authorizeAdmin");

  // Import token generation
  const createConfirmationCode = require("../../../functions/createConfirmationCode");

  // Import email sending
  const sendEmail = require("../../../functions/sendEmail");

  // Import template filling
  const fillTemplate = require("../../../functions/fillTemplate");

  // Import config
  const config = require("../../../config");

  // Create route
  const createUser = async ctx => {
    try {
      // Send error if parameter is missing
      if (
        !ctx.request.body ||
        !ctx.request.body.email ||
        !ctx.request.body.hasOwnProperty("isAdmin")
      ) {
        ctx.response.status = 400;
        return (ctx.response.body = {
          success: false,
          message: "All parameters are required"
        });
      }
      // Send error if email is invalid
      if (!config.emailRegex.test(ctx.request.body.email)) {
        ctx.response.status = 400;
        return (ctx.response.body = {
          success: false,
          message: "Invalid email address"
        });
      }
      // Send error if isAdmin is invalid
      if (
        ctx.request.body.isAdmin !== false &&
        ctx.request.body.isAdmin !== true
      ) {
        ctx.response.status = 400;
        return (ctx.response.body = {
          success: false,
          message: "isAdmin must be true or false."
        });
      }
      // Ensure user is an authenticated administrator
      const actionPermitted = await authorizeAdmin(ctx);
      if (actionPermitted) {
        // Check if user already exists with this email
        const existingUser = await User.findOne({
          email: ctx.request.body.email
        }).exec();
        if (existingUser) {
          ctx.response.status = 409;
          return (ctx.response.body = {
            success: false,
            message: "An account with this email already exists."
          });
        }
        // Create a confirmation code
        const token = createConfirmationCode();
        // Send an email
        sendEmail(
          ctx.request.body.email,
          config.messages.accountSetup.subject,
          fillTemplate(
            config.messages.accountSetup.message,
            actionPermitted.name,
            `${config.url}/setupAccount/${token}`
          )
        );
        // Create user
        const newUser = new User({
          email: ctx.request.body.email,
          isAdmin: ctx.request.body.isAdmin,
          confirmationToken: token
        });
        await newUser.save();
        // Send created user object
        ctx.response.status = 201;
        return (ctx.response.body = {
          success: true,
          user: {
            email: newUser.email,
            isAdmin: newUser.isAdmin
          }
        });
      } else {
        // Send 401 response
        ctx.response.status = 401;
        return (ctx.response.body = {
          success: false,
          message: "User is not authorized"
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

  module.exports = createUser;
})();
