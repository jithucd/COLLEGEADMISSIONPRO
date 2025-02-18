const cors = require("cors");

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
module.exports = cors(corsOptions);