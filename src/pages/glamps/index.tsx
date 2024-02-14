import ExampleExplanation from "@/components/ExampleExplanation";
import { PreviewCard } from "@/components/PreviewCard";
import SearchBar from "@/components/SeachBar";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/button";
import {
  GetDealsOffsetBasedDocument,
  useGetDealsOffsetBasedQuery,
  useGetSearchGlampsQuery,
} from "@/generated/graphql";
import { addApolloState, initializeApollo } from "@/utils/apolloClient";

const EXPLANATION = {
  title: "Offset Pagination - single field query",
  description:
    "Nejjednodušší způsob offset-based paginace, pro sprváný cachování je potřeba nastavit typePolicy v InMemoryCache.",
};

export default function GlampsSearchPage() {
  const { data, loading } = useGetSearchGlampsQuery({
    variables: {
      limit: 3,
      offset: 0,
    },
  });

  if (loading) {
    <div>loading</div>;
  }

  return (
    <Shell as="main" variant="default">
      <h1>Glamping</h1>
      <SearchBar />
      <div className="grid grid-cols-3 gap-3">
        {data?.searchGlamps.glamps.map((glamp) => (
          <PreviewCard key={glamp.id} glamp={glamp} />
        ))}
      </div>
    </Shell>
  );
}

/* export async function getServerSideProps() {
  const apolloClient = initializeApollo({});

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
