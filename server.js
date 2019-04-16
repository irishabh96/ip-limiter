const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const next = require("next");
const { port, url, db } = require("./config");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const test = require("./server/routes/test");

mongoose.connect(db, { useCreateIndex: true, useNewUrlParser: true });
mongoose.connection.on("error", err => {
  console.error("MongoDB connection error: " + err);
  process.exit(-1);
});

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());

    server.use("/test", test);

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on ${url}:${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
