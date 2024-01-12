import ExampleExplanation from "@/components/ExampleExplanation";
import { Button } from "@/components/ui/button";
import {
  GetDealsOffsetBasedDocument,
  useGetDealsOffsetBasedQuery,
} from "@/generated/graphql";
import { addApolloState, initializeApollo } from "@/utils/apolloClient";

const EXPLANATION = {
  title: "Offset Pagination - single field query",
  description:
    "Nejjednodušší způsob offset-based paginace, pro sprváný cachování je potřeba nastavit typePolicy v InMemoryCache.",
};

export default function BasedPagitanionPage() {
  const { data, fetchMore, loading, error } = useGetDealsOffsetBasedQuery({
    variables: {
      limit: 3,
      offset: 0,
    },
  });

  const loadMore = () => {
    const currentLength = data.dealsOffsetBased.length || 0;
    fetchMore({
      variables: {
        offset: currentLength,
        limit: 3,
      },
    });
  };

  if (data?.dealsOffsetBased.length) {
    return (
      <main className="max-w-5xl mx-auto px-3">
        <ExampleExplanation
          title={EXPLANATION.title}
          description={EXPLANATION.description}
        />

        <div className="py-10">
          {data.dealsOffsetBased.map((deal) => (
            <div key={deal.id}>
              <h1>{deal.title}</h1>
            </div>
          ))}
        </div>
        <Button onClick={loadMore}>Načíst další</Button>
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
      limit: 3,
      offset: 0,
    },
  });

  return addApolloState(apolloClient, {
    props: {},
  });
}
