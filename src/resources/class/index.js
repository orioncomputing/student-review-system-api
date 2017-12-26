/* 
   Copyright (c) 2017 Orion Computing LLC.
   Developed by Kian Moretz.
   This code is licensed under the terms of the MIT license.
   See the LICENSE file in the root of this project directory for license terms.
*/
(function() {
  "use strict";

  // Create a router
  const Router = require("koa-router");
  const router = new Router();

  // Set base URL
  const base = "/classes";

  // Import routes
  const routes = require("./routes/index");

  // Create routes
  router.get(base, routes.getClasses);

  // Export router
  module.exports = router;
})();
