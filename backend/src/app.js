const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { connectDB } = require('./config/database'); 

const app = express();

app.use(cors());
app.use(express.json());

connectDB(); 

app.use('/', routes); 

module.exports = app;
