const Pool = require("pg").Pool;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const {
  DB_USER,
  DB_HOST,
  DB_DATABASE,
  DB_PASSWORD,
  DB_PORT,
} = require("../configs");

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT,
});

const { Encrypt, validateEmail, sendEmail } = require("../utils/helpers");

const findByEmail = async (email) => {
  return await pool.query("SELECT email from users where email=$1", [email]);
};

module.exports = {
  register: async (request, response) => {
    const { firstname, lastname, email, password } = request.body;
    const hashedPassword = await Encrypt.cryptPassword(password);

    if (!validateEmail(email)) {
      response
        .status(422)
        .send({ error: "You can only register with OP domain email" });
      return;
    }

    try {
      const emailFinder = await findByEmail(email);
      if (emailFinder.rows.length) {
        response
          .status(422)
          .send({
            error: "This email address already exists, try another mail",
          });
        return;
      }
      sendEmail(email, "localhost:3001/verify/1");

      //  generate uuid for id
      const result = await pool.query(
        "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
        [firstname, lastname, email, hashedPassword]
      );

      email;
      response
        .status(201)
        .send({ message: "Successfully regitered, please verify your email" });
    } catch (error) {
      response.status(400).send({ error: error.message });
    }
  },

  login: async (request, response) => {
    const { email, password } = request.body;

    try {
      const session = crypto.randomBytes(20).toString("hex");

      const foundUser = await pool.query(
        "UPDATE users SET activesession = $1 where email= $2 RETURNING *",
        [session, email]
      );
      const isPasswordCorrect = await Encrypt.comparePassword(
        password,
        foundUser.rows[0].password
      );

      if (foundUser && isPasswordCorrect) {
        const token = jwt.sign(foundUser.rows[0], "@khmakh8yun");
        response
          .status(200)
          .send({ message: "You are logged in, keep this token safe", token });
        return;
      }

      response.status(422).send({ error: "Email or password is incorrect" });
    } catch (error) {
      response.status(400).send({ error: error.message });
    }
  },

  verify: async (request, response) => {
    const id = parseInt(request.params.id);

    try {
      const result = await pool.query(
        "UPDATE users SET email_verified = 't' WHERE id = $1 RETURNING *",
        [id]
      );
      if (!result.rowCount) {
        response.status(404).send({ message: "Not a note with specified id" });
        return;
      }
      response.status(201).send({ message: "Email verified" });
    } catch (error) {
      response.status(400).send({ error: error.message });
    }
  },

  logout: async (request, response) => {
    const authorization = request.headers.authorization;
    const token = authorization ? authorization.split(" ")[1] : "";

    try {
      const decoded = jwt.verify(token, "@khmakh8yun");
      const foundUser = await pool.query(
        "select activesession from users where email = $1",
        [decoded.email]
      );
      if (
        foundUser.rows[0].activesession &&
        foundUser.rows[0].activesession == decoded.activesession
      ) {
        const result = await pool.query(
          "UPDATE users SET activesession = $1 where email= $2 RETURNING *",
          [null, decoded.email]
        );
        response.status(200).send({ error: "User logged out successfully" });
      } else {
        response.status(200).send({ error: "Active session is out of date" });
      }
    } catch (error) {
      response.status(400).send({ error: error.message });
    }
  },
};
