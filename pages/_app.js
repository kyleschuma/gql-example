import '../styles/globals.css';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from './apollo-client';

export default function App({ Component, pageProps }) {
  const apollo = useApollo(pageProps.initialState);

  return (
    <ApolloProvider client={apollo}>
      <Component />
    </ApolloProvider>
  );
}
