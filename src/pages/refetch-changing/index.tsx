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
import { useCreateDealMutation, useGetDealsQuery } from "@/generated/graphql";
import { cn } from "@/lib/utils";

const EXPLANATION = {
  title: "Refetching - observations",
  description: "Zkoumání",
};

export default function RefetchPage() {
  const { data, loading, refetch } = useGetDealsQuery();
  if (loading) {
    return <div>Loading...</div>;
  }

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
              Když nastavím fetch policy standby, tak se ta komponenta nezmění
              pokud je refetch z jiné komponenty.
            </li>
          </ul>
        </div>
      </ExampleExplanation>
      <CreateDealForm />
      <div className="mt-4 py-8 px-4 border-blue-800 bg-blue-300 rounded-lg flex flex-wrap gap-8">
        {data?.deals.length && (
          <div>
            <Button variant="outline" onClick={() => refetch()}>
              TOP LVL. Refetch
            </Button>
            {data.deals &&
              data.deals.map((deal) => (
                <div key={deal.id}>
                  <p>
                    {deal.title}
                    <span
                      className={cn("text-sm text-green-900", {
                        "text-red-500": !deal.isActive,
                      })}
                    >
                      ({deal.isActive ? "true" : "false"})
                    </span>
                  </p>
                </div>
              ))}
          </div>
        )}
        <ShowDeals />
      </div>
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
    },
  });

  const [mutation, { loading }] = useCreateDealMutation();

  function onSubmit(data: DealInputs) {
    mutation({
      variables: {
        title: data.title,
        description: data.description,
        isActive: data.isActive,
      },
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
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
  );
};

const ShowDeals = () => {
  const { data, loading, error, refetch } = useGetDealsQuery();

  if (data?.deals.length)
    return (
      <div className="border-white border-2 p-4 flex gap-4">
        <div>
          <Button variant="outline" onClick={() => refetch()}>
            Children refetch
          </Button>

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
                    ({deal.isActive ? "true" : "false"})
                  </span>
                </h1>
              </div>
            ))}
        </div>
        <ShowDealsGrandChildren />
      </div>
    );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error..</div>;
  }
};

export const ShowDealsGrandChildren = () => {
  const { data, loading, error, refetch } = useGetDealsQuery({
    fetchPolicy: "standby",
  });

  console.log(data);
  if (data?.deals.length)
    return (
      <div className="border-orange-700 border-2 p-1">
        <Button onClick={() => refetch()}>Grand Children refetch</Button>
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
                  ({deal.isActive ? "true" : "false"})
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
