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

type CardProps = React.ComponentProps<typeof Card> & {
  glamp: Glamp;
};

export function PreviewCard({ className, glamp, ...props }: CardProps) {
  return (
    <Card className={cn("w-[380px]", className)} {...props}>
      <CardHeader>
        <CardTitle>{glamp.title}</CardTitle>
        <CardDescription>{glamp.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4"></CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
