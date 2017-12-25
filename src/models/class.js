/* 
   Copyright (c) 2017 Orion Computing LLC.
   Developed by Kian Moretz.
   This code is licensed under the terms of the MIT license.
   See the LICENSE file in the root of this project directory for license terms.
*/
(function() {
  "use strict";

  // Require Mongoose
  const mongoose = require("mongoose");

  // Create a model
  const Class = mongoose.model("Class", {
    name: String,
    owner: mongoose.Schema.ObjectId,
    creationDate: { type: Date, default: Date.now }
  });

  module.exports = Class;
})();
