const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');
const { MONGO_URL } = require('./config');

const { PORT = 3001 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode ? err.statusCode : 500)
    .send({ message: err.statusCode ? err.message : 'Произошла ошибка на сервере' });
  next();
});

app.listen(PORT);
