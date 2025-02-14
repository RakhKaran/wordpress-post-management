const express = require('express');
const cors = require('cors');
const fileUpload = require("express-fileupload");
const path = require("path"); // ✅ Add this line
const routes = require('./routes');
const { connectDB } = require('./config/database'); 
require("./models");
require("./cron/cronJob");
const app = express();

app.use(cors());
app.use(fileUpload());
app.use(express.json());

connectDB(); 

const staticPath = path.join(__dirname, "../sandbox");
app.use("/sandbox", express.static(staticPath));
app.use('/', routes); 

module.exports = app;
