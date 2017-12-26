/* 
   Copyright (c) 2017 Orion Computing LLC.
   Developed by Kian Moretz.
   This code is licensed under the terms of the MIT license.
   See the LICENSE file in the root of this project directory for license terms.
*/
(function() {
  "use strict";

  // Import authedUser
  const authedUser = require("../../../functions/authedUser");

  // Import class model
  const Class = require("../../../models/class");

  const getClasses = async ctx => {
    try {
      const user = authedUser(ctx);
      const classes = Class.find({ owner: user._id })
        .exec()
        .map(object => ({ title: object.title }));
      ctx.response.status = 200;
      return (ctx.response.body = {
        success: true,
        classes: classes
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

  module.exports = getClasses;
})();
