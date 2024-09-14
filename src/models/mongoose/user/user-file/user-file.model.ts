import { MongooseModelNames } from '@/types/enums/mongoose-model-names.enum';
import mongoose, { Schema } from 'mongoose';
import { IUserFileMongooseInstanceMethods, IUserFileMongooseModel, UserFileMongoose } from './user-file.type';

const UserFileSchema = new Schema<UserFileMongoose, IUserFileMongooseModel, IUserFileMongooseInstanceMethods>(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
