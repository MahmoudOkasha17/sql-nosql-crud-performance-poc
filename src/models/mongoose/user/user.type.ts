import { UserZodSchema } from '@/schemas/zod/user.schema';
import { Model } from 'mongoose';
import { z } from 'zod';

export type UserMongoose = z.infer<typeof UserZodSchema>;

export interface IUserMongooseInstanceMethods {}

export interface IUserMongooseModel
  extends Model<UserMongoose, Record<string, unknown>, IUserMongooseInstanceMethods> {}
