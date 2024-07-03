import 'dotenv/config'

import fastifyCors from '@fastify/cors'
import helmet from '@fastify/helmet'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { env } from '@/utils/env'

import { completeTodo } from './routes/complete-to-do'
import { createTodo } from './routes/create-to-do'
import { deleteTodo } from './routes/delete-to-do'
import { healthCheck } from './routes/health-check/health-check'
import { listTodo } from './routes/list-to-do'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'To do App',
      description: 'A simple to do app API',
      version: '0.1.0',
      contact: {
        email: 'jinoliveira74@gmail.com',
        name: 'Jin',
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fastifyCors)

app.register(helmet, { global: true })

// TO DO
app.register(createTodo)
app.register(listTodo)
app.register(completeTodo)
app.register(deleteTodo)

// HEALTH CHECK
app.register(healthCheck)

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log(`Server is running on port ${env.SERVER_PORT}`)
})
