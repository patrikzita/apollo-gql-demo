import { Button } from "@/components/ui/button";
import { useGetDealsOffsetWithFilterQuery } from "@/generated/graphql";
import { cn } from "@/lib/utils";

export default function BasedPaginationWithFiltersPage() {
  const { data, loading, refetch } = useGetDealsOffsetWithFilterQuery({
    variables: {
      limit: 3,
      offset: 0,
    },
    fetchPolicy: "cache-first",
  });

  if (loading) {
    return <div>loading</div>;
  }

  return (
    <main className="max-w-5xl mx-auto px-3">
      <div className="py-10">
        {data.dealsOffsetWithFilter.deals &&
          data.dealsOffsetWithFilter.deals.map((deal) => (
            <div key={deal.id}>
              <h1>
                {deal.title}{" "}
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
      <div className="space-x-2">
        <Button
          onClick={() =>
            refetch({
              isActive: undefined,
              limit: 3,
              offset: 0,
            })
          }
        >
          All
        </Button>
        <Button
          onClick={() =>
            refetch({
              isActive: true,
              limit: 3,
              offset: 0,
            })
          }
        >
          Refetch data with isActive
        </Button>
        <Button
          onClick={() =>
            refetch({
              isActive: false,
              limit: 3,
              offset: 0,
            })
          }
        >
          Refetch data with isActive = false
        </Button>
      </div>
    </main>
  );
}
