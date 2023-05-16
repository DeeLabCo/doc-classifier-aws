/* jshint esversion: 8 */
const serverlessExpress = require('@vendia/serverless-express');
const express = require("express");
const cors = require("cors");
const app = express();
const api = require("./routes.js");

// temp cors *, replace with your domain
app.use(cors({ origin: '*' }));
app.use(express.json());

// Lambda main route
app.use("", api);

module.exports.handler = serverlessExpress({ app });

