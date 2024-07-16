import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import User from '../models/user';
import statusCodes from '../constants';
import UnauthorizedError from '../errors/UnauthorizedError';
import ConflictError from '../errors/ConflictError';

const WEEK_IN_MSECS = 3600000 * 24 * 7;

export const getUsers = (_req: Request, res: Response, next: NextFunction) => User.find({})
  .orFail(() => new NotFoundError('Пользователи не найдены'))
  .then((users) => res.send(users))
  .catch(next);

export const getUserById = (req: Request, res: Response, next: NextFunction) => User
  .findById(req.params.userId)
  .orFail(() => new NotFoundError('Пользователь с указанным id не найден'))
  .then((user) => res.send(user))
  .catch(next);

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create(
      {
        name,
        about,
        avatar,
        email,
        password: hash,
      },
    ))
    .then((user) => res.status(statusCodes.CREATED).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError('Пользователь с данной почтой уже существует'),
        );
      }

      if (err.statusCode === statusCodes.BAD_REQUEST) {
        return next(new BadRequestError('Неверные данные пользователя'));
      }

      return next(err);
    });
};

export const updateProfile = (req: Request, res: Response) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.body.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError('Пользователь с указанным id не найден'))
    .then((user) => res.send(user));
};

export const updateAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.body.user._id, { avatar })
    .orFail(() => new NotFoundError('Пользователь с указанным id не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });

      res
        .cookie('jwt', token, { maxAge: WEEK_IN_MSECS, httpOnly: true })
        .send({ message: 'Авторизация прошла успешно' });
    })
    .catch(next);
};

export const getProfileData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { _id } = req.body.user;

  User.findById(_id)
    .orFail(() => new UnauthorizedError('Требуется авторизация'))
    .then((user) => res.send(user))
    .catch(next);
};
