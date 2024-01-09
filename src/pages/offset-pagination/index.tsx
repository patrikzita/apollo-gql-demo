import { Button } from "@/components/ui/button";
import {
  GetDealsOffsetBasedDocument,
  useGetDealsOffsetBasedQuery,
} from "@/generated/graphql";
import { addApolloState, initializeApollo } from "@/utils/apolloClient";

export default function BasedPagitanionPage() {
  const { data, fetchMore, loading } = useGetDealsOffsetBasedQuery({
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

  console.log(data);
  if (loading) {
    return <div>loading</div>;
  }

  return (
    <main className="max-w-5xl mx-auto px-3">
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

/* export async function getServerSideProps() {
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
 */
