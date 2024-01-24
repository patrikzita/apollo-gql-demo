import ExampleExplanation from "@/components/ExampleExplanation";
import { useGetErrorWithDataQuery } from "@/generated/graphql";

const EXPLANATION = {
  title: "Error handling - Partial Data",
  description:
    "Error handling pokud příjdou pouze - partial data a je potřeba zobrazit data pouze, které příjdou.",
};

export default function ErrorHandlingPage() {
  const { data, error, loading } = useGetErrorWithDataQuery({
    errorPolicy: "all",
  });

  if (loading) {
    return <div>Načítám...</div>;
  }

  if (data?.deals && data?.getProducts) {
    return (
      <main className="max-w-5xl mx-auto px-3">
        <ExampleExplanation
          title={EXPLANATION.title}
          description={EXPLANATION.description}
        />
        <div className="py-10">
          {data.deals.map((deal) => (
            <div key={deal.id}>
              <h1>{deal.title}</h1>
            </div>
          ))}
        </div>
        <div className="py-10">
          {data.getProducts.map((product) => (
            <div key={product.name}>
              <h1>{product.name}</h1>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    console.log("Error:", error);
  }

  return (
    <main className="max-w-5xl mx-auto px-3">
      <ExampleExplanation
        title={EXPLANATION.title}
        description={EXPLANATION.description}
      />
      {data.deals ? (
        <div className="py-10">
          {data.deals.map((deal) => (
            <div key={deal.id}>
              <h1>{deal.title}</h1>
            </div>
          ))}
        </div>
      ) : data.getProducts ? (
        <div className="py-10">
          {data.getProducts.map((product) => (
            <div key={product.name}>
              <h1>{product.name}</h1>
            </div>
          ))}
        </div>
      ) : (
        <div>Nic tu není</div>
      )}
    </main>
  );
}
