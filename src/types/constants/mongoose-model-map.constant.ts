import { MongooseModelNames } from '@/types/enums/mongoose-model-names.enum';
import { UserMongooseModel } from '@/models/mongoose/user/user.model';
import { UserFileMongooseModel } from '@/models/mongoose/user/user-file/user-file.model';
import { Model } from 'mongoose';

export const MongooseModelMap: Record<MongooseModelNames, Model<any, any>> = {
  [MongooseModelNames.USER]: UserMongooseModel,
  [MongooseModelNames.USER_FILE]: UserFileMongooseModel
};
