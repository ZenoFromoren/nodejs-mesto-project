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
    }),
  }),
  createCard,
);
router.delete(
  '/:cardId',
  celebrate({
    params: {
      cardId: Joi.string().alphanum().length(24).required(),
    },
  }),
  deleteCard,
);
router.put(
  '/:cardId/likes',
  celebrate({
    params: {
      cardId: Joi.string().alphanum().length(24).required(),
    },
  }),
  likeCard,
);
router.delete(
  '/:cardId/likes',
  celebrate({
    params: {
      cardId: Joi.string().alphanum().length(24).required(),
    },
  }),
  dislikeCard,
);

export default router;
