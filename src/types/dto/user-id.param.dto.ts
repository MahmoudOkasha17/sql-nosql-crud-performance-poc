import { z } from 'zod';

export const UserIdParamZodSchema = z.object({
  userId: z.string().transform((val) => BigInt(val))
});
