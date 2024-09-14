import { SequelizeUserFileZodSchema } from '@/schemas/zod/user-file.schema';
import { z } from 'zod';

export type UserFileSequelize = z.infer<typeof SequelizeUserFileZodSchema>;
