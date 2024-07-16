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

router.get(
  '/',
  celebrate({
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
  }),
  getCards,
);
router.post(
  '/',
  celebrate({
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .pattern(
          /^(https?:\/\/)(w{3}\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?(#)?$/,
        ),
      user: Joi.object(),
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
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
  }),
  deleteCard,
);
router.put(
  '/:cardId/likes',
  celebrate({
    params: {
      cardId: Joi.string().alphanum().length(24).required(),
    },
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
  }),
  likeCard,
);
router.delete(
  '/:cardId/likes',
  celebrate({
    params: {
      cardId: Joi.string().alphanum().length(24).required(),
    },
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
  }),
  dislikeCard,
);

export default router;
