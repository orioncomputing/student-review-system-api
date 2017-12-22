(function() {
  "use strict";

  // Import user model
  const User = require("../../../models/user");

  // Import admin authorization
  const authorizeAdmin = require("../../../functions/authorizeAdmin");

  // Create route
  const getUser = async ctx => {
    try {
      // Check for email param
      if (!ctx.params.email) {
        ctx.response.status = 400;
        return (ctx.response.body = {
          success: false,
          message: "Email required"
        });
      }
      // Get user
      const user = await User.findOne({ email: ctx.params.email }).exec();
      // Check if user is an admin
      const actionPermitted = await authorizeAdmin(ctx);
      if (actionPermitted) {
        // Send 404
        if (!user) {
          ctx.response.status = 404;
          return (ctx.response.body = {
            success: false,
            message: "User not found"
          });
        }
        // Send data
        ctx.response.status = 200;
        return (ctx.response.body = {
          success: true,
          user: {
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin
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

  module.exports = getUser;
})();
