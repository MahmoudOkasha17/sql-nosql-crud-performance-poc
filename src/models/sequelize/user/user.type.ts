import { UserZodSchema } from '@/schemas/zod/user.schema';
import { z } from 'zod';

export type UserSequelize = z.infer<typeof UserZodSchema>;
