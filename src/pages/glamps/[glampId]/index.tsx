import { Shell } from "@/components/Shell";
import {
  GetGlampDocument,
  GetGlampQuery,
  GetGlampQueryVariables,
  useGetGlampQuery,
} from "@/generated/graphql";
import { addApolloState, initializeApollo } from "@/utils/apolloClient";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { isDateRange } from "react-day-picker";
import { DateRange } from "@/components/DateRange";
import { z } from "zod";
import { searchParamsSchema } from "@/lib/validators/searchParams";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  dateRange: z.object({
    from: z.date({ required_error: "A date of birth is required." }),
    to: z.date({ required_error: "A date to is required" }),
  }),
});

const GlampDetailPage = () => {
  const router = useRouter();

  const searchParamsResult = searchParamsSchema.safeParse(router.query);

  let defaultValues = {
    dateRange: {
      from: undefined,
      to: undefined,
    },
    isLuxury: false,
  };

  if (searchParamsResult.success) {
    const { dateFrom, dateTo, isLuxury } = searchParamsResult.data;
    defaultValues = {
      dateRange: {
        from: dateFrom ? new Date(dateFrom) : undefined,
        to: dateTo ? new Date(dateTo) : undefined,
      },
      isLuxury,
    };
  }
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  const { glampId } = router.query;

  const { data, loading } = useGetGlampQuery({
    variables: {
      glampId: Number(glampId),
    },
  });

  if (loading) {
    <div>loading</div>;
  }

  return (
    <Shell>
      <h1>{data.glamp.title}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => {
              const validDateRange = isDateRange(field.value)
                ? field.value
                : { from: undefined, to: undefined };
              return (
                <FormItem className="flex flex-col">
                  <DateRange
                    selected={validDateRange}
                    onSelect={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </Shell>
  );
};

export default GlampDetailPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const apolloClient = initializeApollo({ context });

  const { glampId } = context.query;

  await apolloClient.query<GetGlampQuery, GetGlampQueryVariables>({
    query: GetGlampDocument,
    variables: {
      glampId: Number(glampId),
    },
  });

  return addApolloState(apolloClient, {
    props: {},
  });
}
