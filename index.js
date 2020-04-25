/***************************************
 *        Express configuration        *
 ***************************************/
const PORT = process.env.PORT | 5000;
const express = require('express');
const app = express();

app
  .use(express.json())
  .use(express.urlencoded({extended: false}))
  .use((res,req,next) => {
    console.log(req.method + ' ' + req.url + ' ' + JSON.stringify(req.body));
    next();
  })

/*************************************
 *        Mongo configuration        *
 *************************************/
const MOGODB_URI = process.env.MOGODB_URI;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


/************************
 *        routes        *
 ************************/
app.get('/', (req, res) => {
  res.status(200).end('This is the front page');
});

module.exports = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});