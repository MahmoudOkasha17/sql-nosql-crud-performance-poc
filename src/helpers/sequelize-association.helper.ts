import { UserFileSequelizeModel } from '@/models/sequelize/user/user-file/user-file.model';
import { UserSequelizeModel } from '@/models/sequelize/user/user.model';

export function registerSequelizeAssociations() {
  UserSequelizeModel.hasMany(UserFileSequelizeModel, {
    foreignKey: 'userId',
    as: 'files',
    onDelete: 'CASCADE'
  });
  UserFileSequelizeModel.belongsTo(UserSequelizeModel, {
    foreignKey: 'userId',
    as: 'user'
  });
}
