import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  test: {
    environment: 'node',
    // Bundle the GraphQL server packages so they share the test's ESM copy of `graphql`
    // instead of loading the CommonJS build as a second instance.
    server: { deps: { inline: [/graphql-yoga/, /@graphql-tools/, /@graphql-yoga/] } }
  }
});
