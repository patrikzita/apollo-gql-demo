import { PreviewCard } from "@/components/PreviewCard";
import SearchBar from "@/components/SeachBar";
import { Shell } from "@/components/Shell";
import {
  GetSearchGlampsDocument,
  GetSearchGlampsQuery,
  GetSearchGlampsQueryVariables,
  useGetSearchGlampsQuery,
} from "@/generated/graphql";
import { getValidSearchParams } from "@/lib/validators/searchParams";
import { addApolloState, initializeApollo } from "@/utils/apolloClient";
import { formatISO } from "date-fns";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { DateRange } from "react-day-picker";

export default function GlampsSearchPage() {
  const router = useRouter();

  const validSearchParams = getValidSearchParams(router.query);

  const { data, loading, refetch } = useGetSearchGlampsQuery({
    variables: {
      limit: 3,
      offset: 0,
      isLuxury: validSearchParams.isLuxury,
    },
    fetchPolicy: "cache-first",
    nextFetchPolicy: "network-only",
  });

  const handleSearch = async ({
    variables,
    dateRange,
  }: {
    variables: GetSearchGlampsQueryVariables;
    dateRange: DateRange;
  }) => {
    const searchParams = {
      isLuxury: variables.isLuxury ?? false,
      dateFrom: formatISO(dateRange.from) ?? undefined,
      dateTo: formatISO(dateRange.to) ?? undefined,
    };

    // Bez await je zkreslený middleware a dostává pozdě datumy
    await router.push({
      pathname: router.pathname,
      query: { ...searchParams },
    });

    refetch(variables);
  };

  if (loading) {
    <div>loading</div>;
  }

  return (
    <Shell as="main" variant="default">
      <h1>Glamping</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="grid md:grid-cols-3 gap-3">
        {data?.searchGlamps.glamps.map((glamp) => (
          <PreviewCard
            key={glamp.id}
            glamp={glamp}
            queryParams={router.query}
          />
        ))}
      </div>
    </Shell>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const apolloClient = initializeApollo({ context });

  const validSearchParams = getValidSearchParams(context.query);

  await apolloClient.query<GetSearchGlampsQuery, GetSearchGlampsQueryVariables>(
    {
      query: GetSearchGlampsDocument,
      variables: {
        limit: 3,
        offset: 0,
        isLuxury: validSearchParams.isLuxury,
      },
    }
  );

  return addApolloState(apolloClient, {
    props: {},
  });
}
