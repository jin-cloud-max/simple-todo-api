import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from './_errors/bad-request-error'

export async function deleteTodo(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/todo/:id',
    {
      schema: {
        tags: ['Todo'],
        summary: 'Delete a to do',
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const todoExists = await prisma.todo.findUnique({
        where: {
          id,
        },
      })

      if (!todoExists) {
        throw new BadRequestError('To do not found')
      }

      await prisma.todo.delete({
        where: {
          id,
        },
      })

      reply.status(204).send()
    },
  )
}
