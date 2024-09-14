import { Types } from 'mongoose';
import { z } from 'zod';

export const BaseUserFileZodSchema = z.object({
  fileName: z.string(),
  fileType: z.string()
});

export const MongooseUserFileZodSchema = BaseUserFileZodSchema.extend({
  _id: z.instanceof(Types.ObjectId).optional(),
  userId: z.instanceof(Types.ObjectId)
}).strict();

export const SequelizeUserFileZodSchema = BaseUserFileZodSchema.extend({
  _id: z.number().int().positive().optional(),
  userId: z.number().int().positive()
}).strict();
