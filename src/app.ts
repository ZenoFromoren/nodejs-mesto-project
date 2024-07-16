import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import helmet from 'helmet';
import notFoundPage from './middlewares/notFoundPage';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import errorHandler from './middlewares/errorHandler';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import signUpValidation from './middlewares/signUpValidation';
import signInValidation from './middlewares/signInValidation';
import { requestLogger, errorLogger } from './middlewares/logger';

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

app.post('/signin', signInValidation(), login);
app.post('/signup', signUpValidation(), createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('*', notFoundPage);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
