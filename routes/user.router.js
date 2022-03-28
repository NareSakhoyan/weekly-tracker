const { Router } = require("express");
const session = require('./middlewares/session')
const controllers = require("../controllers");

const userRouter = Router();

userRouter.put("login/", session, controllers.login);
userRouter.post("register/", controllers.register);
userRouter.put("verify/:id/", controllers.verify);
userRouter.put("logout/", controllers.logout);

module.exports = { userRouter };
