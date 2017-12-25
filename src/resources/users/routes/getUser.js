(function() {
  "use strict";

  // Import user model
  const User = require("../../../models/user");

  // Import admin authorization
  const authorizeAdmin = require("../../../functions/authorizeAdmin");

  // Import jwt
  const jwt = require("jsonwebtoken");

  // Import config
  const config = require("../../../config");

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
      let actionPermitted = await authorizeAdmin(ctx);
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
        // Allow users to view their own details
        if (!ctx.request.headers["authorization"]) {
          ctx.response.status = 400;
          return (ctx.response.body = {
            success: false,
            message: "Authorization header required"
          });
        }
        const token = ctx.request.headers["authorization"].split(" ")[1];
        // Verify JWT
        if (token) {
          let decoded;
          try {
            decoded = jwt.verify(token, config.secret);
          } catch (error) {
            ctx.response.status = 401;
            return (ctx.response.body = {
              success: false,
              message: "User is not authorized"
            });
          }
          // Find user and check if IDs are equal
          const authUser = await User.findOne({ email: decoded.email });
          if (String(authUser._id) == String(user._id)) {
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
          }
        }
        // Send 401 response
        ctx.response.status = 401;
        return (ctx.response.body = {
          success: false,
          message: "User is not authorized"
        });
      }
    } catch (error) {
      console.log(error);
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
