import ExampleExplanation from "@/components/ExampleExplanation";
import { Button } from "@/components/ui/button";
import {
  GetDealsOffsetBasedDocument,
  useGetDealsOffsetBasedQuery,
} from "@/generated/graphql";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { addApolloState, initializeApollo } from "@/utils/apolloClient";
import { NetworkStatus } from "@apollo/client";
import { useCallback, useEffect, useRef } from "react";

const EXPLANATION = {
  title: "Scroll Offset Pagination",
  description: "Načítání dat podle pozice na stránce.",
};

export default function ScrollPaginationPage() {
  const { data, fetchMore, loading, error, networkStatus } =
    useGetDealsOffsetBasedQuery({
      variables: {
        limit: 2,
        offset: 0,
      },
      notifyOnNetworkStatusChange: true,
    });

  const loadingMore = networkStatus === NetworkStatus.fetchMore;

  const observerRef = useRef();

  const lastDealElementRef = useCallback((node) => {
    observerRef.current = node;
  }, []);

  const intersectionEntry = useIntersectionObserver(observerRef, {
    threshold: 0.8,
    freezeOnceVisible: false,
  });

  useEffect(() => {
    if (intersectionEntry?.isIntersecting) {
      loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intersectionEntry?.isIntersecting]);

  const loadMore = () => {
    const currentLength = data.dealsOffsetBased.length || 0;
    fetchMore({
      variables: {
        offset: currentLength,
        limit: 2,
      },
    });
  };

  if (data?.dealsOffsetBased.length) {
    return (
      <main className="max-w-5xl mx-auto px-3 h-screen">
        <ExampleExplanation
          title={EXPLANATION.title}
          description={EXPLANATION.description}
          className="py-10"
        >
          <div className="py-1">
            <h3 className="font-semibold">Poznámky</h3>
            <ul className="text-xs space-y-2">
              <li>
                - v ideálním stavu by bylo potřeba ještě nastavit ať už se
                nevolá loadMore v případě, že už nejsou další data k dispozici
              </li>
            </ul>
          </div>
        </ExampleExplanation>
        <div className="py-10">
          <div>
            <span>Počet načtených dealů: {data.dealsOffsetBased.length}</span>
          </div>
          <div className="py-10">
            {data.dealsOffsetBased.map((deal, index) => (
              <div
                key={deal.id}
                className="h-72 border p-2"
                ref={
                  index === data.dealsOffsetBased.length - 1
                    ? lastDealElementRef
                    : null
                }
              >
                <h1>{deal.title}</h1>
              </div>
            ))}
          </div>
          {loadingMore && <div>Načítám další data</div>}
        </div>
      </main>
    );
  }

  if (loading) {
    return <div>loading</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return <div>Nic tu není</div>;
}

export async function getServerSideProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: GetDealsOffsetBasedDocument,
    variables: {
      limit: 2,
      offset: 0,
    },
  });

  return addApolloState(apolloClient, {
    props: {},
  });
}
