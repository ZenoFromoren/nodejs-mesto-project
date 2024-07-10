import { ErrorRequestHandler } from 'express';
import statusCodes from '../constants';

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  const statusCode = err.statusCode || statusCodes.default;
  const message = statusCode === statusCodes.default
    ? 'На сервере произошла ошибка'
    : err.message;

  res.status(statusCode).send({
    message,
  });

  next();
};

export default errorHandler;
