const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');

const app = express();
app.use(bodyParser.json());

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

async function connect() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`App connected to ${MONGO_URL}`);
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

app.use((req, res, next) => {
  req.user = {
    _id: '639717c5c9a78c3d523a243e',
  };
  next();
});

app.use(router);

app.get('/', (req, res) => {
  res.send('llll');
});

connect();
