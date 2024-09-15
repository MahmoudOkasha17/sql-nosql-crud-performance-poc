import { CreateUserSqlDtoZodSchema } from './create-user.dto';

export const UpdateUserSqlDtoZodSchema = CreateUserSqlDtoZodSchema.partial({
  firstName: true,
  lastName: true
}).strict();
