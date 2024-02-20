import SearchBar from "@/components/SeachBar";
import { Shell } from "@/components/Shell";
import { GetSearchGlampsQueryVariables } from "@/generated/graphql";
import { formatISO } from "date-fns";
import { useRouter } from "next/router";
import { DateRange } from "react-day-picker";

export default function SearchHomepage() {
  const router = useRouter();

  const handleSearch = ({
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

    router.push({
      pathname: "/glamps",
      query: { ...searchParams },
    });
  };

  return (
    <Shell as="main" variant="default">
      <h1 className="text-2xl text-green-600 font-bold">
        GlampingCZ homepage DEMO
      </h1>
      <SearchBar onSearch={handleSearch} />
    </Shell>
  );
}
