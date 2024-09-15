import { z } from 'zod';

export const BaseUserFileZodSchema = z.object({
  _id: z.bigint().optional(),
  userId: z.bigint().optional(),
  fileName: z.string(),
  fileType: z.string()
});

export const MongooseUserFileZodSchema = BaseUserFileZodSchema.extend({}).strict();

export const SequelizeUserFileZodSchema = BaseUserFileZodSchema.extend({}).strict();
