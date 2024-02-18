import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { offsetLimitPagination } from "@apollo/client/utilities";
import merge from "deepmerge";
import isEqual from "lodash/isEqual";
import { GetServerSidePropsContext } from "next";
import { useMemo } from "react";
import qs from "qs";

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

function createApolloClient(context?: GetServerSidePropsContext) {
  const searchParams =
    typeof window !== "undefined"
      ? window.location.search.substring(1)
      : qs.stringify(context?.query);

  const languageLink = createLanguageMiddleware(context?.locale ?? "cs");
  const dateRangeLink = createDateRangeMiddleware(searchParams);

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: from([errorLink, languageLink, dateRangeLink, httpLink]),
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
            dealsOffsetBased: offsetLimitPagination(),
            dealsOffsetWithFilter: {
              keyArgs: ["isActive"],
              merge(existing, incoming, { args: { offset = 0, isActive } }) {
                console.log({ existing });
                console.log({ incoming });
                const mergedDeals = existing ? existing.deals.slice(0) : [];
                for (let i = 0; i < incoming.deals.length; i++) {
                  mergedDeals[offset + i] = incoming.deals[i];
                }

                return {
                  deals: mergedDeals,
                  totalCount: incoming.totalCount,
                };
              },
            },
            cursorPaginatedDeals: {
              keyArgs: false,
              merge(existing = { edges: [], pageInfo: {} }, incoming) {
                const edgeMap = new Map(
                  existing.edges.map((edge) => [edge.cursor, edge])
                );

                incoming.edges.forEach((edge) => {
                  edgeMap.set(edge.cursor, edge);
                });

                const mergedEdges = Array.from(edgeMap.values());
                console.log(mergedEdges);
                const pageInfo = incoming.pageInfo;

                return { edges: mergedEdges, pageInfo };
              },
              read(existing) {
                return existing;
              },
            },
          },
        },
      },
    }),
  });
}

type InitializeApolloParams = {
  initialState?: NormalizedCacheObject;
  context?: GetServerSidePropsContext;
};

export function initializeApollo({
  initialState = null,
  context,
}: InitializeApolloParams) {
  const _apolloClient = apolloClient ?? createApolloClient(context);

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
  const store = useMemo(
    () => initializeApollo({ initialState: state }),
    [state]
  );
  return store;
}

function createLanguageMiddleware(language: string) {
  return new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        "x-language": language,
      },
    }));

    return forward(operation);
  });
}

function createDateRangeMiddleware(searchParams: string) {
  return new ApolloLink((operation, forward) => {
    const currentSearchParams =
      typeof window !== "undefined"
        ? window.location.search.substring(1)
        : searchParams;

    const params = new URLSearchParams(currentSearchParams);

    const dateFrom = params.get("dateFrom");
    const dateTo = params.get("dateTo");

    const dateRange = JSON.stringify({
      from: dateFrom,
      to: dateTo,
    });

    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        "x-date-range": dateRange,
      },
    }));

    return forward(operation);
  });
}
