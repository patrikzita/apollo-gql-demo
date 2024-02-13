import ExampleExplanation from "@/components/ExampleExplanation";
import { Button } from "@/components/ui/button";
import {
  GetDealsOffsetBasedDocument,
  GetDealsOffsetBasedExpandedDocument,
  useGetDealsOffsetBasedExpandedQuery,
  useGetDealsOffsetBasedQuery,
} from "@/generated/graphql";
import { addApolloState, initializeApollo } from "@/utils/apolloClient";
import { NetworkStatus } from "@apollo/client";

const EXPLANATION = {
  title: "Offset Pagination - rozšířené query",
  description:
    "Tento příklad demonstruje offset paginaci, která se používá pro načítání dat v určitých intervalech. 'Single field query' znamená, že dotaz je založen pouze na jednom poli, například 'ID'. V tomto případě se však jedná o 'rozšířený dotaz', kde se využívají více fieldů (např. deals a totalCount). Důležité je, že tento pattern funguje efektivně při server-side rendering, protože SSR umožňuje rychlejší načítání komponent na straně serveru předtím, než jsou odeslány klientovi. V případě, že dotaz obsahuje více polí, je potřeba správně nastavit 'type policies' v 'inMemoryCache', aby se zajistilo efektivní cachování dat a optimalizovala se výkon aplikace.",
};

export default function BasedPagitanionPage() {
  const { data, fetchMore, loading, error, refetch, networkStatus } =
    useGetDealsOffsetBasedExpandedQuery({
      variables: {
        limitTotal: 3,
        offsetTotal: 0,
      },
      notifyOnNetworkStatusChange: true,
    });

  const isLoadingMoreDeals = networkStatus === NetworkStatus.fetchMore;
  const isRefetching = networkStatus === NetworkStatus.refetch;

  const loadMore = () => {
    const currentLength = data.dealsOffsetBasedExpanded.deals.length || 0;
    fetchMore({
      variables: {
        offsetTotal: currentLength,
        limitTotal: 3,
      },
    });
  };

  const areMoreDeals =
    data.dealsOffsetBasedExpanded.deals.length <
    data.dealsOffsetBasedExpanded.totalCount;

  if (data.dealsOffsetBasedExpanded) {
    return (
      <main className="max-w-5xl mx-auto px-3">
        <ExampleExplanation
          title={EXPLANATION.title}
          description={EXPLANATION.description}
        >
          <div className="py-1">
            <h3 className="font-semibold">Poznámky</h3>
            <ul className="text-xs">
              <li>refetch defaultně má nastavené variables hooku</li>
              <li>Pořadí podmínek v tomto příkladu funguje pouze při SSR</li>
              <li>
                Musí být nastavený v options hooku notifyOnNetworkStatusChange,
                jinak networkStatus ukazuje stále na &apos;ready&apos; (7)
              </li>
            </ul>
          </div>
        </ExampleExplanation>
        <div className="py-8">
          {data.dealsOffsetBasedExpanded.deals &&
            data.dealsOffsetBasedExpanded.deals.map((deal) => (
              <div key={deal.id}>
                <h1>{deal.title}</h1>
              </div>
            ))}
          {!areMoreDeals && (
            <div className="pt-2 text-sm text-red-400">
              Žádné další výsledky
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {areMoreDeals && (
            <Button onClick={loadMore} disabled={isLoadingMoreDeals}>
              {isLoadingMoreDeals ? "Loading..." : "Show More"}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            {isRefetching ? "Refetching deals..." : "Refetch"}
          </Button>
        </div>
      </main>
    );
  }

  if (loading && !isLoadingMoreDeals) return <div>Loading</div>;

  if (error) {
    return <div>Něco se pokazilo</div>;
  }

  return <div className="max-w-5xl mx-auto px-3">Nic tu není</div>;
}

export async function getServerSideProps() {
  const apolloClient = initializeApollo({});

  await apolloClient.query({
    query: GetDealsOffsetBasedExpandedDocument,
    variables: {
      limitTotal: 3,
      offsetTotal: 0,
    },
  });

  return addApolloState(apolloClient, {
    props: {},
  });
}
