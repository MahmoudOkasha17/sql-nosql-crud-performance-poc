import { MongooseModelNames } from '@/types/enums/mongoose-model-names.enum';
import mongoose, { Schema } from 'mongoose';
import { IUserFileMongooseInstanceMethods, IUserFileMongooseModel, UserFileMongoose } from './user-file.type';
import { generateUniqueIdSnowflake } from '@/helpers/unique-id-generator.helper';

const UserFileSchema = new Schema<UserFileMongoose, IUserFileMongooseModel, IUserFileMongooseInstanceMethods>(
  {
    _id: {
      type: Schema.Types.BigInt,
      required: true,
      default: () => {
        return generateUniqueIdSnowflake();
      }
    },
    userId: {
      type: Schema.Types.BigInt,
      ref: MongooseModelNames.USER,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

UserFileSchema.index({ userId: 1 });

export const UserFileMongooseModel = mongoose.model(MongooseModelNames.USER_FILE, UserFileSchema);
