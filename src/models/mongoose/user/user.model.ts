import { MongooseModelNames } from '@/types/enums/mongoose-model-names.enum';
import mongoose, { Schema } from 'mongoose';
import { IUserMongooseInstanceMethods, IUserMongooseModel, UserMongoose } from './user.type';

const UserSchema = new Schema<UserMongoose, IUserMongooseModel, IUserMongooseInstanceMethods>(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const UserMongooseModel = mongoose.model(MongooseModelNames.USER, UserSchema);
