import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
};

const ExampleExplanation = ({
  title,
  description,
  children,
  className,
}: Props) => {
  return (
    <div className={cn("py-3", className)}>
      <h1 className="font-bold">{title}</h1>
      <p className="text-xs">{description}</p>
      {children}
    </div>
  );
};

export default ExampleExplanation;
