import { sequelizeClient } from '@/config/sql-db';
import { SequelizeModelNames } from '@/types/enums/sequelize-model-names.enum';
import { UserSequelize } from './user.type';
import { DataTypes, Model } from 'sequelize';

export const UserSequelizeModel = sequelizeClient.define<Model<UserSequelize>>(
  SequelizeModelNames.USER,
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: true
  }
);
