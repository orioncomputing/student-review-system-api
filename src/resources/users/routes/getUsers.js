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

  // Create route
  const getUsers = async ctx => {
    try {
      // Get all users
      const users = await User.find().exec();
      // If no users, return empty array
      if (users.length === 0) {
        ctx.response.status = 200;
        return (ctx.response.body = {
          success: true,
          users: []
        });
      }
      // Check if user is an admin
      const actionPermitted = await authorizeAdmin(ctx);
      if (actionPermitted) {
        // Filter user data for only needed info
        const filteredUsers = users.map(user => {
          return {
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin
          };
        });
        // Send data
        ctx.response.status = 200;
        return (ctx.response.body = {
          success: true,
          users: filteredUsers
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

  module.exports = getUsers;
})();
