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
