import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import {
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required(),
      owner: Joi.object(),
      likes: Joi.array().items(Joi.object()).default([]),
      createdAt: Joi.date().default(Date.now()),
    }),
  }),
  createCard,
);
router.delete(
  '/:cardId',
  celebrate({
    params: {
      cardId: Joi.string().alphanum().required(),
    },
  }),
  deleteCard,
);
router.put(
  '/:cardId/likes',
  celebrate({
    params: {
      cardId: Joi.string().alphanum().required(),
    },
  }),
  likeCard,
);
router.delete(
  '/:cardId/likes',
  celebrate({
    params: {
      cardId: Joi.string().alphanum().required(),
    },
  }),
  dislikeCard,
);

export default router;
