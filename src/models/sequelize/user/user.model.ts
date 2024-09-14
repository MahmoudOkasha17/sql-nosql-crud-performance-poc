import { sequelizeClient } from '@/config/sql-db';
import { SequelizeModelNames } from '@/types/enums/sequelize-model-names.enum';
import { DataTypes } from 'sequelize';
import { IUserSequelizeModel } from './user.type';
import { generateUniqueIdSnowflake } from '@/helpers/unique-id-generator.helper';

export const _UserSequelizeModel = sequelizeClient.define(
  SequelizeModelNames.USER,
  {
    _id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      defaultValue: generateUniqueIdSnowflake
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
    timestamps: true,
    indexes: [
      {
        fields: ['_id'],
        unique: true
      }
    ]
  }
) as IUserSequelizeModel;

export const UserSequelizeModel = _UserSequelizeModel;
