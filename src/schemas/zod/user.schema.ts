import { Types } from 'mongoose';
import { z } from 'zod';

export const BaseUserZodSchema = z.object({
  firstName: z.string(),
  lastName: z.string()
});

export const MongooseUserZodSchema = BaseUserZodSchema.extend({
  _id: z.instanceof(Types.ObjectId).optional()
}).strict();

export const SequelizeUserZodSchema = BaseUserZodSchema.extend({
  _id: z.number().int().positive().optional()
}).strict();
