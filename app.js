const express = require('express');

const mongoose = require('mongoose');

const usersRouter = require('./routes/usersRouter');

const cardsRouter = require('./routes/cardsRouter');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6349a39861489784e93d29f7',
  };

  next();
});

app.use('/users', usersRouter);

app.use('/cards', cardsRouter);

app.get('*', (req, res) => {
  res.status(404).send({
    message: 'Страница не найдена',
  });
});

app.patch('*', (req, res) => {
  res.status(404).send({
    message: 'Страница не найдена',
  });
});

app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});
