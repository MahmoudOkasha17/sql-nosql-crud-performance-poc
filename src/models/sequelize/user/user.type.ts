import { SequelizeUserZodSchema } from '@/schemas/zod/user.schema';
import { BuildOptions, Model } from 'sequelize';
import { z } from 'zod';

export type UserSequelize = z.infer<typeof SequelizeUserZodSchema>;

export interface UserSequelizeInstance extends Model<UserSequelize>, UserSequelize {}

export type IUserSequelizeModel = typeof Model & {
  new (values?: object, options?: BuildOptions): UserSequelizeInstance;
};
