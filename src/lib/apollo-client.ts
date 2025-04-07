import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:8088/graphql", 
  // uri: 'https://truk-be.onrender.com/graphql',
  cache: new InMemoryCache(),
});

export default client;
