import { BaseUserZodSchema } from '@/schemas/zod/user.schema';

export const CreateUserSqlDtoZodSchema = BaseUserZodSchema.pick({
  firstName: true,
  lastName: true
}).strict();
