import { createYoga } from 'graphql-yoga';
import { schema } from '@/graphql/schema';

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  graphiql: process.env.NODE_ENV !== 'production',
  fetchAPI: { Response }
});

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS };
