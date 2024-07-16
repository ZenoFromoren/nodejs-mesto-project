import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { isEmail, isURL } from 'validator';
import UnauthorizedError from '../errors/UnauthorizedError';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface IUserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<mongoose.Document<unknown, any, IUser>>;
}

const userSchema = new mongoose.Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 200,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: isURL,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: isEmail,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.static(
  'findUserByCredentials',
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
      .select('+password')
      .then((user) => {
        if (!user) {
          throw new UnauthorizedError('Неверные почта или пароль');
        }

        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неверные почта или пароль');
          }

          return user;
        });
      });
  },
);

export default mongoose.model<IUser, IUserModel>('user', userSchema);
