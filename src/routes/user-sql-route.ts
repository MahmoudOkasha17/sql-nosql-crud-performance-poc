import express from 'express';

// Import controllers from
import { createUser, deleteUser, errorUser, getUser, getUsers, updateUser } from '@/controllers/user-sql-controller';
import { verify } from '@/middleware/auth-middleware';
import { zodValidate } from '@/middleware/zod-validation-middleware';
import { GetUsersSqlQueryZodSchema } from './dto/get-users.dto';
import { UserIdParamZodSchema } from '@/types/dto/user-id.param.dto';
import { CreateUserSqlDtoZodSchema } from './dto/create-user.dto';
import { UpdateUserSqlDtoZodSchema } from './dto/update-user.dto';

// Setup router
const router = express.Router();

// Setup all routes for user

router.get('/error', errorUser);

router.post('/', verify, zodValidate(CreateUserSqlDtoZodSchema, 'body'), createUser);

router.get('/', verify, zodValidate(GetUsersSqlQueryZodSchema, 'query'), getUsers);

router.get('/:userId', verify, zodValidate(UserIdParamZodSchema, 'params'), getUser);

router.patch(
  '/:userId',
  verify,
  zodValidate(UserIdParamZodSchema, 'params'),
  zodValidate(UpdateUserSqlDtoZodSchema, 'body'),
  updateUser
);

router.delete('/:userId', verify, zodValidate(UserIdParamZodSchema, 'params'), deleteUser);

// Export router; should always export as default
export default router;
