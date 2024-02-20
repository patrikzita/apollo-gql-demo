import { ParsedUrlQuery } from "querystring";
import { z } from "zod";

const stringToBoolean = (val: unknown) => {
  if (val === "true") return true;
  if (val === "false") return false;
  return val;
};

export const searchParamsSchema = z.object({
  dateFrom: z.string().datetime({ offset: true }),
  dateTo: z.string().datetime({ offset: true }),
  isLuxury: z.preprocess(stringToBoolean, z.boolean()),
});

export const getValidSearchParams = (query: ParsedUrlQuery) => {
  const parsedResult = searchParamsSchema.safeParse(query);
  if (parsedResult.success) {
    return parsedResult.data;
  } else {
    return {
      dateFrom: undefined,
      dateTo: undefined,
      isLuxury: false,
    };
  }
};
