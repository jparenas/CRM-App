import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import { getGraphQlEndpoint } from "@/service/url";
import { axios } from "@/service/axios";

const { buildAxiosFetch } = require("@lifeomic/axios-fetch");

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: getGraphQlEndpoint(),
  fetch: buildAxiosFetch(axios)
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache
});
