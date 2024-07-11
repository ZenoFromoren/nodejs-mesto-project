import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import helmet from 'helmet';
import notFoundPage from './middlewares/notFoundPage';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import errorHandler from './middlewares/errorHandler';

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.locals.user = {
    _id: '668ce920a38330aa5150869f',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('*', notFoundPage);

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
