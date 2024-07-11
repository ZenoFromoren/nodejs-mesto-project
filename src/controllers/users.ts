import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import User from '../models/user';
import statusCodes from '../constants';

export const getUsers = (_req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send(users))
  .catch((err) => next(err));

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.findById(req.params.userId)
  .orFail(() => new NotFoundError('Пользователь с указанным id не найден'))
  .then((user) => res.send(user))
  .catch(next);

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(statusCodes.CREATED).send(user))
    .catch((err) => {
      if (err.statusCode === statusCodes.BAD_REQUEST) {
        return next(new BadRequestError('Неверные данные пользователя'));
      }

      return next(err);
    });
};

export const updateProfile = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    res.locals.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError('Пользователь с указанным id не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

export const updateAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(res.locals.user._id, { avatar })
    .orFail(() => new NotFoundError('Пользователь с указанным id не найден'))
    .then((user) => res.send(user))
    .catch(next);
};
