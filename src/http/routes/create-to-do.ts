import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

export async function createTodo(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/todo',
    {
      schema: {
        tags: ['Todo'],
        summary: 'Create a new To Do',
        body: z.object({
          name: z.string(),
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
      const { name } = request.body

      const todo = await prisma.todo.create({
        data: {
          name,
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
