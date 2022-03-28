const express = require("express");
const routes = require("./routes");

const { SERVER_PORT: PORT } = require("./configs");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Weekly tracker. Credits to Optimum Partners",
  });
});

routes(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app };
