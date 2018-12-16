require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const util = require('util')
const articleRouter = require('./routers/article')


const app = express()

const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use('/article', articleRouter)


// 在 localhost 走 8080 port
let server = app.listen(port, function() {
    console.log("My server running on port", port);
});

module.exports = { app };