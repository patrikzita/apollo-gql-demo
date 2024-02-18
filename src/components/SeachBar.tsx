import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { searchParamsSchema } from "@/lib/validators/searchParams";
import { useRouter } from "next/router";
import { isDateRange } from "react-day-picker";
import { DateRange } from "./DateRange";
import { Checkbox } from "./ui/checkbox";

const FormSchema = z.object({
  dateRange: z.object({
    from: z.date({ required_error: "A date of birth is required." }),
    to: z.date({ required_error: "A date to is required" }),
  }),
  isLuxury: z.boolean().default(false).optional(),
});

type SearchBarProps = {
  onSearch: ({ variables, dateRange }) => void;
};

function SearchBar({ onSearch }: SearchBarProps) {
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
    onSearch({
      dateRange: data.dateRange,
      variables: {
        offset: 0,
        limit: 3,
        isLuxury: data.isLuxury,
      },
    });

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <>
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
                  <FormLabel>Date of birth</FormLabel>
                  <DateRange
                    selected={validDateRange}
                    onSelect={field.onChange}
                  />
                  <FormDescription>
                    Your date of birth is used to calculate your age.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="isLuxury"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Luxury Glamping</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}

export default SearchBar;
