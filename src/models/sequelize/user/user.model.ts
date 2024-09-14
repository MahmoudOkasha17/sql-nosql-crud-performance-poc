import { sequelizeClient } from '@/config/sql-db';
import { SequelizeModelNames } from '@/types/enums/sequelize-model-names.enum';
import { DataTypes, Model } from 'sequelize';
import { IUserSequelizeModel, UserSequelize } from './user.type';

export const _UserSequelizeModel = sequelizeClient.define(
  SequelizeModelNames.USER,
  {
    _id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
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
) as IUserSequelizeModel;

export const UserSequelizeModel = _UserSequelizeModel;
