import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { useMemo } from 'react';

let client;

export function connectApollo() {
  if (client) return client;

  const link = new HttpLink({
    uri: '/api/graphql',
    credentials: 'same-origin',
  });
  const cache = new InMemoryCache();

  return new ApolloClient({
    cache,
    link,
    ssrMode: false,
  });
}

export function useApollo(state) {
  return useMemo(() => {
    const instance = connectApollo();
    if (state) {
      // hydrate the instance
      instance.cache.restore(state);
    }
    return instance;
  }, [state]);
}
