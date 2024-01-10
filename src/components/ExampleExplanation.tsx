import { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  children?: ReactNode;
};

const ExampleExplanation = ({ title, description, children }: Props) => {
  return (
    <div className="py-3">
      <h1 className="font-bold">{title}</h1>
      <p className="text-xs">{description}</p>
      {children}
    </div>
  );
};

export default ExampleExplanation;
