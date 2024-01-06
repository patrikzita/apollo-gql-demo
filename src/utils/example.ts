const colors = ["text-green-500", "text-blue-500", "text-violet-500"] as const;

type ExtractColor<S extends string> = S extends `text-${infer R}-500` ? R : S;

const findColor = (color: ExtractColor<(typeof colors)[number]>) => {
  return colors.find((c) => c.includes(color));
};

const color = "text-red-500";

findColor("violet");
