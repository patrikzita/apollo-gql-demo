import { Button } from "@/components/ui/button";
import {
  GetDealsOffsetBasedDocument,
  GetDealsOffsetBasedExpandedDocument,
  useGetDealsOffsetBasedExpandedQuery,
  useGetDealsOffsetBasedQuery,
} from "@/generated/graphql";
import { addApolloState, initializeApollo } from "@/utils/apolloClient";

export default function BasedPagitanionPage() {
  const { data, fetchMore, loading } = useGetDealsOffsetBasedExpandedQuery({
    variables: {
      limitTotal: 3,
      offsetTotal: 0,
    },
  });

  const loadMore = () => {
    const currentLength = data.dealsOffsetBasedExpanded.deals.length || 0;
    console.log(currentLength);
    fetchMore({
      variables: {
        offsetTotal: currentLength,
        limitTotal: 3,
      },
    });
  };

  console.log(data);
  if (loading) {
    return <div>loading</div>;
  }

  return (
    <main className="max-w-5xl mx-auto px-3">
      <div className="py-10">
        {data.dealsOffsetBasedExpanded.deals &&
          data.dealsOffsetBasedExpanded.deals.map((deal) => (
            <div key={deal.id}>
              <h1>{deal.title}</h1>
            </div>
          ))}
      </div>
      <Button onClick={loadMore}>Načíst další</Button>
    </main>
  );
}

/* export async function getServerSideProps() {
  const apolloClient = initializeApollo();

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
 */
