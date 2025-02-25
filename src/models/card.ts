import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

interface ICard {
  name: string;
  link: string;
  owner: ObjectId;
  likes: ObjectId[];
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
    },
    owner: {
      type: ObjectId,
      required: true,
    },
    likes: [
      {
        type: ObjectId,
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { versionKey: false },
);

export default mongoose.model<ICard>('card', cardSchema);
