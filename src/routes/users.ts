import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import {
  createUser,
  getUserById,
  getUsers,
  updateAvatar,
  updateProfile,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get(
  '/:userId',
  celebrate({
    params: {
      userId: Joi.string().alphanum().length(24).required(),
    },
  }),
  getUserById,
);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(200).required(),
      avatar: Joi.string().required(),
    }),
  }),
  createUser,
);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(200).required(),
    }),
  }),
  updateProfile,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required(),
    }),
  }),
  updateAvatar,
);

export default router;
