import { ApolloClient, InMemoryCache } from "@apollo/client";

const graphclient = new ApolloClient({
  uri: "https://truk-be.onrender.com/graphql",
  cache: new InMemoryCache(),
});

export default graphclient;

'https://truk-be.onrender.com'

// uri: "http://localhost:8088/graphql",