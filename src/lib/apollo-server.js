import { SchemaLink } from '@apollo/client/link/schema';
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache
} from '@apollo/client-integration-nextjs';
import { schema } from '@/graphql/schema';

// Server Components execute queries against the schema in-process instead of over HTTP.
export const { getClient, query } = registerApolloClient(
  () =>
    new ApolloClient({
      cache: new InMemoryCache(),
      link: new SchemaLink({ schema })
    })
);
