import { sequelizeClient } from '@/config/sql-db';
import { SequelizeModelNames } from '@/types/enums/sequelize-model-names.enum';
import { DataTypes, Model } from 'sequelize';
import { UserFileSequelize } from './user-file.type';

const _UserFileSequelizeModel = sequelizeClient.define<Model<UserFileSequelize>>(
  SequelizeModelNames.USER_FILE,
  {
    _id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      }
    ]
  }
);

export const UserFileSequelizeModel = _UserFileSequelizeModel;
