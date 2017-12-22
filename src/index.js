/* 
   Copyright (c) 2017 Orion Computing LLC.
   Developed by Kian Moretz.
   This code is licensed under the terms of the MIT license.
   See the LICENSE file in the root of this project directory for license terms.
*/
(function() {
  "use strict";

  // Import npm dependencies
  const Koa = require("koa");
  const bodyParser = require("koa-bodyparser");
  const mongoose = require("mongoose");

  // Fix the Promise configuration for Mongoose
  mongoose.Promise = Promise;

  // Import configuration file
  const config = require("./config");

  // Import resource controllers
  const users = require("./resources/users/index");

  // Create new Koa app
  const app = new Koa();

  // Use body parser
  app.use(bodyParser());

  // Use resource controllers
  app.use(users.routes());

  // Connect to database
  mongoose.connect(config.dbString, { useMongoClient: true });

  // Start Koa app
  app.listen(8080);
})();
