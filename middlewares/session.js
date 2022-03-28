const session = require("express-session");

module.exports = (request, response) => {
    session{
        secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
        saveUninitialized:true,
        cookie: { maxAge: oneDay },
        resave: false 
      }
}

