import ExampleExplanation from "@/components/ExampleExplanation";
import { Button } from "@/components/ui/button";
import {
  GetDealsOffsetWithFilterDocument,
  useGetDealsOffsetWithFilterQuery,
} from "@/generated/graphql";
import { cn } from "@/lib/utils";
import { addApolloState, initializeApollo } from "@/utils/apolloClient";
import { useState } from "react";

const EXPLANATION = {
  title: "Offset Pagination - s filtry",
  description: "Trošku náročnější koncept paginace s filtry",
};

export default function BasedPaginationWithFiltersPage() {
  const [filter, setFilter] = useState<boolean | undefined>();

  const { data, loading, error, fetchMore } = useGetDealsOffsetWithFilterQuery({
    variables: {
      limit: 3,
      offset: 0,
      isActive: filter,
    },
  });

  const loadMore = () => {
    // TODO: merge cache objects
    const currentLength = data.dealsOffsetWithFilter.deals.length || 0;
    fetchMore({
      variables: {
        offset: currentLength,
        limit: 3,
      },
    });
  };

  if (data?.dealsOffsetWithFilter?.deals) {
    return (
      <main className="max-w-5xl mx-auto px-3">
        <ExampleExplanation
          title={EXPLANATION.title}
          description={EXPLANATION.description}
        >
          <div className="py-1">
            <h3 className="font-semibold">Poznámky</h3>
            <ul className="text-xs">
              <li>
                - Mění se zde data, díky tomu že se změní state filters a celá
                komponenta se re-renderuje
              </li>
              <li>
                - Nepoužívá se zde refetch pro změnu filtrů, protože nebere v
                potaz cache.
              </li>
            </ul>
          </div>
        </ExampleExplanation>
        <div className="space-x-2">
          <Button onClick={() => setFilter(undefined)}>All</Button>
          <Button onClick={() => setFilter(true)}>Data with isActive</Button>
          <Button onClick={() => setFilter(false)}>
            Data with isActive = false
          </Button>
        </div>
        <div className="py-10">
          {data.dealsOffsetWithFilter.deals &&
            data.dealsOffsetWithFilter.deals.map((deal) => (
              <div key={deal.id}>
                <h1>
                  {deal.title}
                  <span
                    className={cn("text-sm text-green-400", {
                      "text-red-500": !deal.isActive,
                    })}
                  >
                    ({deal.isActive ? "true" : "false"})
                  </span>
                </h1>
              </div>
            ))}
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={loadMore}>
            Show More
          </Button>
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

  return <div>Asi se sem nedostanu</div>;
}

export async function getServerSideProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: GetDealsOffsetWithFilterDocument,
    variables: {
      limit: 3,
      offset: 0,
    },
  });

  return addApolloState(apolloClient, {
    props: {},
  });
}
