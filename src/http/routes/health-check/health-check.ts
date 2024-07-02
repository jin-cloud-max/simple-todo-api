import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

export async function healthCheck(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/health-check',
    {
      schema: {
        tags: ['Health-Check'],
        summary: 'Check API health',
        response: {
          200: z.object({
            status: z.literal('ok'),
            database: z.object({
              status: z.enum(['ok', 'error']),
            }),
            memory: z.object({
              rss: z.number(),
              heapTotal: z.number(),
              heapUsed: z.number(),
              external: z.number(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const db = await prisma.$queryRaw`SELECT 1`

      const memory = process.memoryUsage()

      reply.status(200).send({
        status: 'ok',
        database: {
          status: db ? 'ok' : 'error',
        },
        memory: {
          rss: memory.rss,
          heapTotal: memory.heapTotal,
          heapUsed: memory.heapUsed,
          external: memory.external,
        },
      })
    },
  )
}
