/* 
   Copyright (c) 2017 Orion Computing LLC.
   Developed by Kian Moretz.
   This code is licensed under the terms of the MIT license.
   See the LICENSE file in the root of this project directory for license terms.
*/
(function() {
  "use strict";

  // Import routes
  const getUsers = require("./getUsers");
  const getUser = require("./getUser");
  const setup = require("./setup");
  const authenticate = require("./authenticate");

  // Export routes
  module.exports = {
    getUsers,
    getUser,
    setup,
    authenticate
  };
})();
