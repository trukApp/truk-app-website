import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:8088/graphql/graphql", // Replace with your actual GraphQL endpoint
  cache: new InMemoryCache(),
});

export default client;
