const express = require("express");
const redis = require("../../redis-database");
const Users = require("../../models/user");
const app = express();

const checkIp = (req, res, next) => {
  let ip = req.connection.remoteAddress.split(":").pop();

  redis.get(ip, function(error, result) {
    if (error) {
      console.log(error);
    }
    if (result) {
      try {
        redis.incr(ip);
        next();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        redis.set(ip, 1, redis.print);
        next();
      } catch (error) {
        console.log(error);
      }
    }
  });
};

app.post("/", checkIp, (req, res, next) => {
  Users.create({ ...req.body })
    .then(user => res.status(200).json(user))
    .catch(err => {
      if (err.name === "MongoError" && err.code === 11000) {
        console.log("User Already Exists");
        res.status(409).json({
          valid: false,
          param: "email",
          message: "email already registered"
        });
      } else {
        res.status(400).json({
          valid: false,
          param: err.name,
          message: "Missing Field"
        });
      }
    });
});

app.get("/", (req, res, next) => {
  let ip = req.connection.remoteAddress.split(":").pop();

  redis.get(ip, (error, result) => {
    if (error) {
      res.status(400).json({ err: "Something Went Wrong!" });
    } else if (result) {
      res.json({ result });
    } else {
      res.json({ err: "No Content Found!" });
    }
  });
});
module.exports = app;
