import { UserFileSequelizeModel } from '@/models/sequelize/user/user-file/user-file.model';
import { UserSequelizeModel } from '@/models/sequelize/user/user.model';
import { SequelizeModelNames } from '@/types/enums/sequelize-model-names.enum';
import { Model, ModelCtor } from 'sequelize';

export const SequelizeModelMap: Record<SequelizeModelNames, ModelCtor<Model<any, any>>> = {
  [SequelizeModelNames.USER]: UserSequelizeModel,
  [SequelizeModelNames.USER_FILE]: UserFileSequelizeModel
};
