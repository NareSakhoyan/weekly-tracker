const {userRouter} = require('./user.router')
const {logsRouter} = require('./user.router')

module.exports = (app) => {
  // user realted routes
  app.use("/", userRouter);

  // tracker realted routes
  app.use("/log", logsRouter);
};
