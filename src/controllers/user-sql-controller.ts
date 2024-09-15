import { asyncHandler } from '@/middleware/async-middleware';
import { UserSequelizeModel } from '@/models/sequelize/user/user.model';
import { UserSequelize, UserSequelizeInstance } from '@/models/sequelize/user/user.type';
import { CreateUserSqlDtoZodSchema } from '@/routes/dto/create-user.dto';
import { GetUsersSqlQueryZodSchema } from '@/routes/dto/get-users.dto';
import { UpdateUserSqlDtoZodSchema } from '@/routes/dto/update-user.dto';
import { UserIdParamZodSchema } from '@/types/dto/user-id.param.dto';
import { ApiError } from '@/utils/ApiError';
import { ApiSuccess } from '@/utils/ApiSucess';
import { NextFunction, Request, Response } from 'express';
import { Op, WhereOptions } from 'sequelize';
import { z } from 'zod';

export const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body as z.infer<typeof CreateUserSqlDtoZodSchema>;

  const user = await UserSequelizeModel.create(body);

  res.status(200).json(
    new ApiSuccess<UserSequelizeInstance>({
      payload: {
        data: user
      }
    })
  );
});

export const getUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { limit, page, search } = req.query as unknown as z.infer<typeof GetUsersSqlQueryZodSchema>;

  const matchQuery: WhereOptions<UserSequelize> = {
    ...(search && {
      [Op.or]: [
        {
          firstName: {
            [Op.like]: '%' + search + '%'
          }
        },
        {
          lastName: {
            [Op.like]: '%' + search + '%'
          }
        }
      ]
    })
  };

  const [total, data] = await Promise.all([
    UserSequelizeModel.count({
      where: matchQuery
    }),
    UserSequelizeModel.findAll({
      limit,
      offset: limit * page,
      where: matchQuery
    })
  ]);

  res.status(200).json(
    new ApiSuccess<UserSequelizeInstance[]>({
      payload: {
        data,
        total,
        limit,
        page,
        pages: Math.ceil(total / limit)
      }
    })
  );
});

export const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params as unknown as z.infer<typeof UserIdParamZodSchema>;

  const user = await UserSequelizeModel.findByPk(userId);

  if (!user) {
    throw new ApiError({}, 404, 'User not found');
  }

  res.status(200).json(
    new ApiSuccess<UserSequelizeInstance>({
      payload: {
        data: user
      }
    })
  );
});

export const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params as unknown as z.infer<typeof UserIdParamZodSchema>;

  const user = await UserSequelizeModel.findByPk(userId);

  if (!user) {
    throw new ApiError({}, 404, 'User not found');
  }

  const body = req.body as z.infer<typeof UpdateUserSqlDtoZodSchema>;

  await user.update(body);

  res.status(200).json(new ApiSuccess<UserSequelizeInstance>({ payload: { data: user } }));
});

export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params as unknown as z.infer<typeof UserIdParamZodSchema>;

  const user = await UserSequelizeModel.findByPk(userId);

  if (!user) {
    throw new ApiError({}, 404, 'User not found');
  }

  await user.destroy();

  res.status(200).json(new ApiSuccess({}));
});

export const errorUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Return json with error message and empty data
  throw new ApiError({}, 500, 'Handled by asyncHandler');
});
