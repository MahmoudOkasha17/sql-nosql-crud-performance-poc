import { MongooseUserZodSchema } from '@/schemas/zod/user.schema';
import { Model } from 'mongoose';
import { z } from 'zod';

export type UserMongoose = z.infer<typeof MongooseUserZodSchema>;

export interface IUserMongooseInstanceMethods {}

export interface IUserMongooseModel
  extends Model<UserMongoose, Record<string, unknown>, IUserMongooseInstanceMethods> {}
