import { createUserSchema } from '@/schemas'
import { z } from 'zod'

export type CreateUserDto = z.infer<typeof createUserSchema>
