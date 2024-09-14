import { z } from 'zod';

export const UserZodSchema = z.object({
  firstName: z.string(),
  lastName: z.string()
});
