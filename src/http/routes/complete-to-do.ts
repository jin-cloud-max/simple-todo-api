import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from './_errors/bad-request-error'

export async function completeTodo(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/todo/:id',
    {
      schema: {
        tags: ['Todo'],
        summary: 'Set to do as done',
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          201: z.object({
            id: z.number(),
            name: z.string(),
            done: z.boolean(),
            createdAt: z.date(),
            updatedAt: z.date(),
          }),
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

      const todo = await prisma.todo.update({
        where: {
          id,
        },
        data: {
          done: true,
        },
      })

      reply.status(201).send({
        id: todo.id,
        name: todo.name,
        done: todo.done,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
      })
    },
  )
}
