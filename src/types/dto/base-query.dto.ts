import { z } from 'zod';

export const BasePaginationQueryZodSchema = z
  .object({
    page: z.number({ coerce: true }).int().min(1).optional().default(1),
    limit: z.number({ coerce: true }).int().min(0).optional().default(10)
  })
  .strict();

export const BaseSearchQueryZodSchema = BasePaginationQueryZodSchema.extend({
  search: z.string().trim().optional()
}).strict();
