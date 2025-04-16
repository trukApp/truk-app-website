import { ApolloClient, InMemoryCache } from "@apollo/client";

const graphclient = new ApolloClient({
  uri: "http://localhost:8088/graphql",
  cache: new InMemoryCache(),
});

export default graphclient;


// uri: "https://truk-be.onrender.com/graphql",
// uri: "http://localhost:8088/graphql",