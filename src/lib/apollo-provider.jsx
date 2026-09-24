'use client';

import { HttpLink } from '@apollo/client';
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache
} from '@apollo/client-integration-nextjs';

const makeClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ uri: '/api/graphql' })
  });

const ApolloProvider = ({ children }) => (
  <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
);

export default ApolloProvider;
