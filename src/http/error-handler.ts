import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'

import { BadRequestError } from './routes/_errors/bad-request-error'

export type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = async (
  error,
  request,
  reply,
) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      errors: error.flatten().fieldErrors,
      message: 'Validation error',
    })
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  console.error(error)

  // send error to some observability service

  return reply.status(500).send({
    message: 'Internal Server Error',
  })
}
