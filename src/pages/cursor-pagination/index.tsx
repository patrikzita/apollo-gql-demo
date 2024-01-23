import ExampleExplanation from "@/components/ExampleExplanation";
import { Button } from "@/components/ui/button";
import {
  useDeleteDealMutation,
  useGetCursorPaginatedDealsQuery,
} from "@/generated/graphql";

const EXPLANATION = {
  title: "Relay-style Cursor Pagination",
  description:
    "Vždy se identifikuje poslední prvek podle nějakého unikátního klíče ID/Timestamp, etc.",
};

export default function CursorPaginationPage() {
  const { data, fetchMore, loading, error } = useGetCursorPaginatedDealsQuery({
    variables: { limit: 3 },
  });

  const [deleteDeal] = useDeleteDealMutation({
    update(cache, { data }) {
      const deletedId = data?.deleteDeal.deletedId;
      if (deletedId) {
        cache.modify({
          fields: {
            cursorPaginatedDeals(existingData, { readField }) {
              const newEdges = existingData.edges.filter((edge) => {
                return readField("id", edge.node) !== String(deletedId);
              });

              return { ...existingData, edges: newEdges };
            },
          },
        });
      }
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  const nodes = data.cursorPaginatedDeals.edges.map((edge) => edge.node);
  const pageInfo = data.cursorPaginatedDeals.pageInfo;

  const loadMore = () => {
    if (pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          afterCursor: pageInfo.endCursor,
        },
      });
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (data?.cursorPaginatedDeals.edges.length) {
    return (
      <main className="max-w-5xl mx-auto px-3">
        <ExampleExplanation
          title={EXPLANATION.title}
          description={EXPLANATION.description}
        />

        <div className="py-10 space-y-3">
          {nodes.map((node) => (
            <div key={node.id} className="flex gap-2 items-center">
              <h1>{node.title}</h1>
              <Button
                variant="destructive"
                onClick={() =>
                  deleteDeal({
                    variables: { deleteDealId: Number(node.id) },
                  })
                }
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
        {data.cursorPaginatedDeals.pageInfo.hasNextPage && (
          <Button onClick={loadMore}>Načíst další</Button>
        )}
      </main>
    );
  }

  return <div>Nic tu není</div>;
}
