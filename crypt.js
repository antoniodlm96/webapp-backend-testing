const bcrypt = require('bcrypt');

function hash(data) {
  console.log("hasing data");

  return bcrypt.hashSync(data, 10);
}

function checkPassword(passwordFromUserInPlainText, passwordFromDBHashed) {
console.log("Checking password");

return bcrypt.compareSync(passwordFromUserInPlainText, passwordFromDBHashed);
}

module.exports.hash = hash;
module.exports.checkPassword = checkPassword;
