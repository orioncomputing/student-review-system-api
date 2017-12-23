/* 
   Copyright (c) 2017 Orion Computing LLC.
   Developed by Kian Moretz.
   This code is licensed under the terms of the MIT license.
   See the LICENSE file in the root of this project directory for license terms.
*/
(function() {
  "use strict";

  const fillTemplate = (string, ...args) => {
    const splitString = string.split(" ");
    const newString = [];
    let filled = 0;
    splitString.forEach(word => {
      if (word[0] === "$") {
        newString.push(args[filled]);
        filled++;
      } else {
        newString.push(word);
      }
    });
    return newString.join(" ");
  };

  module.exports = fillTemplate;
})();
