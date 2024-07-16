import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import statusCodes from '../constants';
import ForbiddenError from '../errors/ForbiddenError';

export const getCards = (_req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(next);

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.body.user._id })
    .then((card) => {
      res.status(statusCodes.CREATED).send(card);
    })
    .catch((err) => {
      if (err.statusCode === statusCodes.BAD_REQUEST) {
        return next(new BadRequestError('Неверные данные карточки'));
      }

      return next(err);
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => Card
  .findById(req.params.cardId)
  .orFail(() => new NotFoundError('Карточка с указанным id не найдена'))
  .then((card) => {
    if (card.owner.toString() === req.body.user._id) {
      Card.findByIdAndDelete(req.params.cardId)
        .then(() => res.send(card));
    } else {
      next(new ForbiddenError('Нельзя удалять чужие карточки'));
    }
  })
  .catch(next);

export const likeCard = (req: Request, res: Response, next: NextFunction) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.body.user._id } },
  { new: true },
)
  .orFail(() => new NotFoundError('Карточка с указанным id не найдена'))
  .then((card) => res.send(card))
  .catch(next);

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => Card
  .findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.body.user._id } },
    { new: true },
  )
  .orFail(() => new NotFoundError('Карточка с указанным id не найдена'))
  .then((card) => res.send(card))
  .catch(next);
