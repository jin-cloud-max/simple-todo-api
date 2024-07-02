import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  SERVER_PORT: z.coerce.number().default(3333),
})

const envServer = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  SERVER_PORT: process.env.SERVER_PORT,
})

if (!envServer.success) {
  console.log(envServer.error.issues)

  throw new Error('There is an error with the server environment variables')
}

export const env = envServer.data
