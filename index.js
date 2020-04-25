/***************************************
 *        Express configuration        *
 ***************************************/
const PORT = process.env.PORT || 5000;
const express = require('express');
const app = express();

app
  .use(express.json())
  .use(express.urlencoded({extended: false}))
  .use((req, res, next) => {
    console.log(req.method + ' ' + req.url + ' ' + JSON.stringify(req.body));
    next();
  })

/*************************************
 *        Mongo configuration        *
 *************************************/
const MONGODB_URI = process.env.MONGODB_URI || '';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}

mongoose.connect(MONGODB_URI, mongooseOptions);
mongoose.connection
  .once('open', () => console.log('Connected to database'))
  .on('error', (err) => console.error(err));


let Highscores = mongoose.model(
  'Highscores',
  new Schema( {highscore: Number, username: String, datetime: Date}, {collection : 'highscores'}),
);

/************************
 *        routes        *
 ************************/
app.get('/', (req, res) => {
  res.status(200).end('This is the front page');
});

app.get('/api/highscores', (req, res) => {
  Highscores
    .find()
    .then(data => res.status(200).send(data))
    .catch(err => {
      console.error(err);
      res.status(500).end('Server error');
    });
});

app.get('/api/highscores/:id', (req, res) => {
  let filter = {_id : req.params.id};

  Highscores
    .findOne(filter)
    .then(data => res.status(200).send(data))
    .catch(err => {
      console.error(err);
      res.status(500).end('Server error');
    });
});

app.put('/api/highscores/:id', (req, res) => {
  let filter = {_id : req.params.id};
  let update = req.body;

  Highscores
    .findOneAndUpdate(filter, update, {new: true})
    .then(() => res.status(200).end())
    .catch(err => {
      console.error(err);
      res.status(500).end('Server error');
    });
});

app.delete('/api/highscores/:id', (req, res) => {
  const filter = {_id : req.params.id};

  Highscores
    .findOneAndDelete(filter)
    .then(() => res.status(200).end())
    .catch(err => {
      console.error(err);
      res.status(500).end('Server error');
    });
});

app.post('/api/highscores', (req, res) => {
  const newHighscore = new Highscores(req.body);

  newHighscore
    .save()
    .then(() => res.status(200).end())
    .catch(err => {
      console.error(err);
      res.status(500).end('Server error');
    });
});

// 404 Route : keep at the bottom
app.use((req, res) => {
  res.status(404).end('404 Error : Page not found');
});

// 500 Route : keep at the bottom
app.use((req, res) => {
  res.status(500).end('500 Error : Server error');
});


module.exports = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});