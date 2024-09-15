import { MongooseModelNames } from '@/types/enums/mongoose-model-names.enum';
import mongoose, { Schema } from 'mongoose';
import { IUserMongooseInstanceMethods, IUserMongooseModel, UserMongoose } from './user.type';
import { generateUniqueIdSnowflake } from '@/helpers/unique-id-generator.helper';

const UserSchema = new Schema<UserMongoose, IUserMongooseModel, IUserMongooseInstanceMethods>(
  {
    _id: {
      type: Schema.Types.BigInt,
      required: true,
      default: () => {
        return generateUniqueIdSnowflake();
      }
    },
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
    timestamps: true,
    toObject: {
      virtuals: true
    }
  }
);

UserSchema.virtual('files', {
  ref: MongooseModelNames.USER_FILE,
  localField: '_id',
  foreignField: 'userId',
  justOne: false
});

export const UserMongooseModel = mongoose.model(MongooseModelNames.USER, UserSchema);
