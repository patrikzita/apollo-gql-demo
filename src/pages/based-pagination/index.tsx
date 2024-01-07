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

  /*   const { data, fetchMore } = useGetDealsOffsetBasedQuery({
    variables: {
      limit: 3,
      offset: 0,
    },
  }); */

  /* const loadMore = () => {
    const currentLength = data.dealsOffsetBased.length || 0;
    console.log(currentLength);
    fetchMore({
      variables: {
        offset: currentLength,
        limit: 3,
      },
    });
  }; */

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
    <main>
      <div>
        {data.dealsOffsetBasedExpanded.deals &&
          data.dealsOffsetBasedExpanded.deals.map((deal) => (
            <div key={deal.id}>
              <h1>{deal.title}</h1>
            </div>
          ))}
        {/*   {data.dealsOffsetBased.deals.map((deal) => (
          <div key={deal.id}>
            <h1>{deal.title}</h1>
          </div>
        ))} */}
        <button onClick={loadMore}>Načíst další</button>
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  const apolloClient = initializeApollo();

  /* await apolloClient.query({
    query: GetDealsOffsetBasedDocument,
    variables: {
      limit: 3,
      offset: 0,
    },
  }); */
  /* await apolloClient.query({
    query: GetDealsOffsetBasedExpandedDocument,
    variables: {
      limitTotal: 3,
      offsetTotal: 0,
    },
  }); */

  return addApolloState(apolloClient, {
    props: {},
  });
}
