import ExampleExplanation from "@/components/ExampleExplanation";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  DealFragmentDoc,
  GetDealsDocument,
  useCreateDealMutation,
  useGetDealsQuery,
} from "@/generated/graphql";
import { cn } from "@/lib/utils";

const EXPLANATION = {
  title: "Mutation - Optimistic UI",
  description:
    "Nastavení mutace, tak aby dočasně nastavila data do Cache, dokud se nevrátí opravdová data.",
};

export default function OptimisticUIPage() {
  return (
    <main className="max-w-5xl mx-auto px-3">
      <ExampleExplanation
        title={EXPLANATION.title}
        description={EXPLANATION.description}
      >
        <div className="py-1">
          <h3 className="font-semibold">Poznámky</h3>
          <ul className="text-xs space-y-2">
            <li>
              - je potřeba nastavit v mutaci optimisticResponse kam se uloží
              dočasný výsledek mutace
            </li>
            <li>
              - aby se to projevilo je potřeba nastavit zase přímý update Cache
              pro určitý fragment.
            </li>
          </ul>
        </div>
      </ExampleExplanation>

      <CreateDealForm />
      <ShowDeals />
    </main>
  );
}

const DealFormSchema = z.object({
  title: z.string().min(2, {
    message: "Deal title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Deal description must be at least 2 characters.",
  }),
  isActive: z.boolean().default(false).optional(),
});

type DealInputs = z.infer<typeof DealFormSchema>;

const CreateDealForm = () => {
  const form = useForm<DealInputs>({
    resolver: zodResolver(DealFormSchema),
    defaultValues: {
      title: "",
      description: "",
      isActive: false,
    },
  });

  const [mutation, { loading }] = useCreateDealMutation({
    update: (cache, { data: { createDeal } }) => {
      cache.modify({
        fields: {
          deals(existingDeals = []) {
            const newDealsRef = cache.writeFragment({
              data: createDeal,
              fragment: DealFragmentDoc,
            });
            return existingDeals.concat(newDealsRef);
          },
        },
      });
    },
  });

  function onSubmit(data: DealInputs) {
    mutation({
      variables: {
        title: data.title,
        description: data.description,
        isActive: data.isActive,
      },
      optimisticResponse: {
        __typename: "Mutation",
        createDeal: {
          __typename: "Deal",
          id: "80",
          title: `${data.title} (Zachvíli zmizím)`,
          description: data.description,
          isActive: data.isActive,
        },
      },
    });
    form.reset();
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Deal title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Deal description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>isActive</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading && <Loader className="h-4 w-4 animate-spin mr-2" />}
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

const ShowDeals = () => {
  const { data, loading, error } = useGetDealsQuery({
    fetchPolicy: "cache-first",
  });

  if (data?.deals.length)
    return (
      <div className="py-8">
        {data.deals &&
          data.deals.map((deal) => (
            <div key={deal.id}>
              <h1>
                {deal.title}
                <span
                  className={cn("text-sm text-green-400", {
                    "text-red-500": !deal.isActive,
                  })}
                >
                  ({deal?.isActive ? "true" : "false"})
                </span>
              </h1>
            </div>
          ))}
      </div>
    );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error..</div>;
  }
};
