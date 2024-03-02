import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z.string().min(1, 'Password is required'),
})

export const signUpSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z.string().min(6, 'Password length must surpass 6 characters'),
})

export const usernameSchema = z.object({
    username: z
        .string()
        .min(3, 'Username length must surpass 3 characters')
        .max(16, 'Username length must be less than 16 characters'),
})

export const ProfileSchema = z.object({
    username: z.string(),
    display_name: z
        .string()
        .max(36, 'Display name must not surpass 36 chars')
        .optional(),
    bio: z.string().max(256, 'Bio must not surpass 256 chars').optional(),
})
