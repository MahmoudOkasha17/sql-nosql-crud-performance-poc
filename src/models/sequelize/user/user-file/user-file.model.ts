import { sequelizeClient } from '@/config/sql-db';
import { SequelizeModelNames } from '@/types/enums/sequelize-model-names.enum';
import { DataTypes, Model } from 'sequelize';
import { UserFileSequelize } from './user-file.type';
import { generateUniqueIdSnowflake } from '@/helpers/unique-id-generator.helper';

const _UserFileSequelizeModel = sequelizeClient.define<Model<UserFileSequelize>>(
  SequelizeModelNames.USER_FILE,
  {
    _id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      defaultValue: generateUniqueIdSnowflake
    },
    userId: {
      type: DataTypes.BIGINT,
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
        fields: ['_id'],
        unique: true
      },
      {
        fields: ['userId']
      }
    ]
  }
);

export const UserFileSequelizeModel = _UserFileSequelizeModel;
