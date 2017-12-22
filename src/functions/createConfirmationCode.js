/* 
   Copyright (c) 2017 Orion Computing LLC.
   Developed by Kian Moretz.
   This code is licensed under the terms of the MIT license.
   See the LICENSE file in the root of this project directory for license terms.
*/
(function() {
  "use strict";

  const crypto = require("crypto");

  const createConfirmationCode = () => {
    return crypto.randomBytes(12).toString("hex");
  };

  module.exports = createConfirmationCode;
})();
