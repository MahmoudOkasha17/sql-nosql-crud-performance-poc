import { MongooseUserFileZodSchema } from '@/schemas/zod/user-file.schema';
import { Model } from 'mongoose';
import { z } from 'zod';

export type UserFileMongoose = z.infer<typeof MongooseUserFileZodSchema>;

export interface IUserFileMongooseInstanceMethods {}

export interface IUserFileMongooseModel
  extends Model<UserFileMongoose, Record<string, unknown>, IUserFileMongooseInstanceMethods> {}
