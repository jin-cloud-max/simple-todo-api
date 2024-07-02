import type { FastifyInstance } from 'fastify'
import z from 'zod'

import { prisma } from '@/lib/prisma'

export async function listTodo(app: FastifyInstance) {
  app.get(
    '/todo',
    {
      schema: {
        tags: ['Todo'],
        summary: 'List all to do',
        response: {
          200: z.object({
            todos: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                done: z.boolean(),
                createdAt: z.date(),
                updatedAt: z.date(),
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const todos = await prisma.todo.findMany()

      reply.send({
        todos,
      })
    },
  )
}
