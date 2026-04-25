"use strict";

const path = require("path");
const express = require("express");

const app = express();
const root = __dirname;

app.disable("x-powered-by");

app.get("/health", function (_req, res) {
  res.status(200).type("text/plain").send("ok");
});

app.use(express.static(root));

const port = Number(process.env.PORT) || 3000;
app.listen(port, function () {
  console.log("Portfolio listening on port " + port);
});
