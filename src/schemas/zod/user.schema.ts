import { z } from 'zod';

export const BaseUserZodSchema = z.object({
  _id: z.bigint().optional(),
  firstName: z.string(),
  lastName: z.string()
});

export const MongooseUserZodSchema = BaseUserZodSchema.extend({}).strict();

export const SequelizeUserZodSchema = BaseUserZodSchema.extend({}).strict();
