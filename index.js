require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const app = express();

const swaggerSetup  = require('./swagger');
swaggerSetup(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/user', userRoutes);

mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('connected to database');
        console.log('app listening on port 3000');
        console.log('document server listening on http://localhost:3000/api-docs');
        app.listen(3000);
    })
    .catch(err => {
        console.log('error connect to database', err);
    });