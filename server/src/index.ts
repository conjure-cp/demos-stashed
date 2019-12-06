import 'reflect-metadata'
import { ApolloServer, PubSubEngine } from 'apollo-server'
import * as path from 'path'

import { buildSchema } from 'type-graphql'
import { ProblemResolver } from './resolvers/problem.resolver'
import { ProblemService } from './service/problem.service'
import { Container } from 'typedi'
import { pubSub } from './pubsub'

Container.set('PUB_SUB', pubSub);


const bootstrap = async () => {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [ProblemResolver],
    // automatically create `schema.gql` file with schema definition in current folder
    emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
    container: Container,
  })

  // Create GraphQL server
  const server = new ApolloServer({
    schema,
    // enable GraphQL Playground
    playground: true,
  })

  // Start the server
  const { url } = await server.listen(4000)
  console.log(`Server is running, GraphQL Playground available at ${url}`)
}

bootstrap()
