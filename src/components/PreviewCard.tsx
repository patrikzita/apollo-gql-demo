import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Glamp } from "@/generated/graphql";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";

type CardProps = React.ComponentProps<typeof Card> & {
  glamp: Glamp;
  queryParams?: ParsedUrlQuery;
};

export function PreviewCard({
  className,
  glamp,
  queryParams,
  ...props
}: CardProps) {
  const linkHref = {
    pathname: `/glamps/${glamp.id}`,
    query: queryParams,
  };

  return (
    <Card className={cn(className)} {...props}>
      <Link href={linkHref}>
        <CardHeader>
          <CardTitle className={cn({ "text-yellow-600": glamp.isLuxury })}>
            {glamp.title}
          </CardTitle>
          <CardDescription>{glamp.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4"></CardContent>
        <CardFooter>
          <p>
            {formatDate(new Date(glamp.availableFrom), "dd.MMMM yyyy")} -{" "}
            {formatDate(new Date(glamp.availableTo), "dd.MMMM yyyy")}
          </p>
        </CardFooter>
      </Link>
    </Card>
  );
}
