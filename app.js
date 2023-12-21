const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const router = require('./routes');

const app = express();

app.use(bodyParser.json());

const { PORT = 9090, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

async function connect() {
  try {
    await mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
    console.log(`App connected ${MONGO_URL}`);
    app.listen(PORT);
    console.log(`App listening on port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
}
app.listen(9090);

app.use((req, res, next) => {
  req.user = {
    _id: '639717c5c9a78c3d523a243e',
  };
  next();
});
// подключаем роуты
app.use(router);
app.get('/', (req, res) => {
  res.send('hkhh');
});
connect();
