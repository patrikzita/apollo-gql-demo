import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import {
  concatPagination,
  offsetLimitPagination,
} from "@apollo/client/utilities";
import merge from "deepmerge";
import isEqual from "lodash/isEqual";
import { useMemo } from "react";

const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

let apolloClient: ApolloClient<NormalizedCacheObject>;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = new HttpLink({
  uri: "http://localhost:3000/api/graphql",
  credentials: "same-origin",
});

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: from([errorLink, httpLink]),
    connectToDevTools: true,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            dealsOffsetBasedExpanded: {
              keyArgs: false, // None of the arguments will be used to generate a separate cache entry
              merge(existing, incoming, { args: { offsetTotal = 0 } }) {
                // Combines the incoming list of deals with the existing list

                const mergedDeals = existing ? existing.deals.slice(0) : [];
                for (let i = 0; i < incoming.deals.length; i++) {
                  mergedDeals[offsetTotal + i] = incoming.deals[i];
                }

                return {
                  ...existing,
                  deals: mergedDeals,
                  totalCount: incoming.totalCount, // Assumes totalCount is updated with each query
                };
              },
            },
          },
        },
      },
    }),
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
    const data = merge(existingCache, initialState, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function addApolloState(
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: any
) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

export function useApollo(pageProps) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state), [state]);
  return store;
}

/* cache: new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        dealsOffsetBasedExpanded: {
          keyArgs: false, // None of the arguments will be used to generate a separate cache entry
          merge(existing, incoming, { args: { offsetTotal = 0 } }) {
            // Combines the incoming list of deals with the existing list
            const mergedDeals = existing ? existing.deals.slice(0) : [];
            for (let i = 0; i < incoming.deals.length; ++i) {
              mergedDeals[offsetTotal + i] = incoming.deals[i];
            }
            // Returns the combined list of deals and the most recent total count
            return {
              ...existing,
              deals: mergedDeals,
              totalCount: incoming.totalCount, // Assumes totalCount is updated with each query
            };
          },
          // The read function is not strictly necessary here unless you need to restructure the returned data
          read(existing) {
            return existing;
          },
        },
      },
    },
  },
}), */
