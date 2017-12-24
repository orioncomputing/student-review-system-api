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

  // Import code generation
  const createConfirmationCode = require("../../../functions/createConfirmationCode");

  // Import template filling
  const fillTemplate = require("../../../functions/fillTemplate");

  // Import email sending
  const sendEmail = require("../../../functions/sendEmail");

  // Import bcrypt
  const bcrypt = require("bcryptjs");

  // Import moment for time manipulation
  const moment = require("moment");

  const patchUser = async ctx => {
    try {
      if (!ctx.request.body || !ctx.request.body.mode) {
        ctx.response.status = 400;
        return (ctx.response.body = {
          success: false,
          message: "Mode is required."
        });
      }
      if (!ctx.params.uniqueId) {
        ctx.response.status = 400;
        return (ctx.response.body = {
          success: false,
          message: "Unique ID required"
        });
      }
      if (ctx.request.body.mode === "user-setup") {
        if (!ctx.request.body.name || !ctx.request.body.password) {
          ctx.response.status = 400;
          return (ctx.response.body = {
            success: false,
            message: "All data is required."
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
        // Find user
        const user = await User.findOne({
          confirmationToken: ctx.params.uniqueId
        });
        if (!user) {
          ctx.response.status = 401;
          return (ctx.response.body = {
            success: false,
            message:
              "The confirmation token is invalid or the account you are trying to set up no longer exists."
          });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(ctx.request.body.password, 10);
        // Modify and save user
        user.password = hashedPassword;
        user.name = ctx.request.body.name;
        user.confirmationToken = "";
        await user.save();
        // Send success response
        ctx.response.status = 200;
        return (ctx.response.body = {
          success: true,
          user: {
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
          }
        });
      } else if (ctx.request.body.mode === "send-password-reset-email") {
        // Find user
        const user = await User.findOne({
          email: ctx.params.uniqueId
        });
        // If no user, fail silently for security
        if (!user) {
          ctx.response.status = 200;
          return (ctx.response.body = {
            success: true
          });
        }
        // Generate a password reset token and expiration date
        const token = createConfirmationCode();
        const expirationDate = moment().add(1, "days");
        // Send email
        sendEmail(
          user.email,
          config.messages.passwordReset.subject,
          fillTemplate(
            config.messages.passwordReset.message,
            `${config.url}/resetPassword/${token}`
          )
        );
        // Modify and save user
        user.passwordResetToken = token;
        user.passwordResetExpires = expirationDate;
        await user.save();
        // Send success
        ctx.response.status = 200;
        return (ctx.response.body = {
          success: true
        });
      } else if (ctx.request.body.mode === "reset-password") {
        // Fail if no password
        if (!ctx.request.body.password) {
          ctx.response.status = 400;
          return (ctx.response.body = {
            success: false,
            message: "Password is required"
          });
        }
        // Find user
        const user = await User.findOne({
          passwordResetToken: ctx.params.uniqueId,
          passwordResetExpires: { $gt: Date.now() }
        });
        // If no user, fail
        if (!user) {
          ctx.response.status = 400;
          return (ctx.response.body = {
            success: false,
            message: "Your password reset token is invalid or expired."
          });
        }
        const hashedPassword = await bcrypt.hash(ctx.request.body.password, 10);
        // Modify and save user
        user.password = hashedPassword;
        user.passwordResetToken = "";
        user.passwordResetExpires = null;
        await user.save();
        // Send success response
        ctx.response.status = 200;
        return (ctx.response.body = {
          success: true,
          user: {
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
          }
        });
      } else if (ctx.request.body.mode === "change-info") {
      } else {
        ctx.response.status = 400;
        return (ctx.response.body = {
          success: false,
          message: "Mode is invalid."
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

  module.exports = patchUser;
})();
