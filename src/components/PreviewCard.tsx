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

type CardProps = React.ComponentProps<typeof Card> & {
  glamp: Glamp;
};

export function PreviewCard({ className, glamp, ...props }: CardProps) {
  return (
    <Card className={cn(className)} {...props}>
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
    </Card>
  );
}
