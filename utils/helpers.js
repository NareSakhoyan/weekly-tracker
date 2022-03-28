const bcrypt = require("bcrypt");

const Encrypt = {
  cryptPassword: (password) =>
    bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hash) => hash),

  comparePassword: (password, hashPassword) =>
    bcrypt.compare(password, hashPassword).then((resp) => resp),
};

const validateEmail = (email) => {
  //this validates only optimumparterns.co emails
  return /(^[a-zA-Z0-9_.+-]+@optimumpartners.co)/.test(email);
};

module.exports = { Encrypt, validateEmail };
