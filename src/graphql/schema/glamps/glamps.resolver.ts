import { db } from "@/db/db";
import { glamps as dbGlamps } from "@/db/schema";
import { and, count, eq, gte, lte } from "drizzle-orm";
import { Arg, Ctx, Float, Int, Query, Resolver } from "type-graphql";
import { Glamp, GlampsResponse } from "./glamps";
import type { MyContext } from "@/pages/api/graphql";
import { z } from "zod";

const DateRangeSchema = z.object({
  from: z.string().datetime({ offset: true }),
  to: z.string().datetime({ offset: true }),
});

type DateRange = z.infer<typeof DateRangeSchema>;

@Resolver(Glamp)
export class GlampResolver {
  @Query(() => [Glamp])
  async glamps(): Promise<Glamp[]> {
    const glamps = db.select().from(dbGlamps).all();
    return glamps;
  }

  @Query(() => GlampsResponse)
  async searchGlamps(
    @Arg("offset", () => Int) offset: number,
    @Arg("limit", () => Int) limit: number,
    @Ctx() ctx: MyContext,
    @Arg("isLuxury", { nullable: true }) isLuxury?: boolean,
    @Arg("minPrice", () => Float, { nullable: true }) minPrice?: number,
    @Arg("maxPrice", () => Float, { nullable: true }) maxPrice?: number
  ): Promise<GlampsResponse> {
    let dateRange: DateRange | undefined;
    const dateRangeHeader = ctx.req.headers["x-date-range"];

    if (dateRangeHeader) {
      const parsedDateRange = JSON.parse(dateRangeHeader as string);
      const result = DateRangeSchema.safeParse(parsedDateRange);
      if (result.success) {
        dateRange = result.data;
      } else {
        dateRange = undefined;
      }
    }

    let glampsQueryBuilder = db
      .select()
      .from(dbGlamps)
      .$dynamic()
      .offset(offset)
      .limit(limit);

    let totalCountQueryBuilder = db
      .select({ value: count() })
      .from(dbGlamps)
      .$dynamic();

    /* Strict compliance */
    if (dateRange) {
      const { from, to } = dateRange;
      glampsQueryBuilder = glampsQueryBuilder.where(
        and(lte(dbGlamps.availableFrom, to), gte(dbGlamps.availableTo, from))
      );
      totalCountQueryBuilder = totalCountQueryBuilder.where(
        and(lte(dbGlamps.availableFrom, to), gte(dbGlamps.availableTo, from))
      );
    }

    if (isLuxury === true) {
      glampsQueryBuilder = glampsQueryBuilder.where(
        eq(dbGlamps.isLuxury, isLuxury)
      );
      totalCountQueryBuilder = totalCountQueryBuilder.where(
        eq(dbGlamps.isLuxury, isLuxury)
      );
    }

    if (minPrice && maxPrice) {
      glampsQueryBuilder = glampsQueryBuilder.where(
        and(gte(dbGlamps.price, minPrice), lte(dbGlamps.price, maxPrice))
      );
      totalCountQueryBuilder = totalCountQueryBuilder.where(
        and(gte(dbGlamps.price, minPrice), lte(dbGlamps.price, maxPrice))
      );
    }

    const glamps = await glampsQueryBuilder;
    const totalCountResult = await totalCountQueryBuilder;
    const totalCount = totalCountResult[0].value;
    const hasNextPage = offset + limit < totalCount;

    return {
      glamps,
      pageInfo: {
        hasNextPage,
        total: totalCount,
      },
    };
  }
}
