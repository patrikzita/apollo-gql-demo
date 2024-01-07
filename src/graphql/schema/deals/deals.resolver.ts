import { db } from "@/db/db";
import { deals as dbDeals } from "@/db/schema";
import { Arg, Query, Resolver } from "type-graphql";
import { Deal, DealsResponse } from "./deals";
import { count } from "drizzle-orm";

@Resolver(Deal)
export class DealResolver {
  @Query(() => [Deal])
  async deals(): Promise<Deal[]> {
    const deals = db.select().from(dbDeals).all();
    return deals;
  }
  @Query(() => [Deal])
  async dealsOffsetBased(
    @Arg("offset") offset: number,
    @Arg("limit") limit: number
  ): Promise<Deal[]> {
    const deals = await db.select().from(dbDeals).offset(offset).limit(limit);
    return deals;
  }

  @Query(() => DealsResponse)
  async dealsOffsetBasedExpanded(
    @Arg("offsetTotal") offset: number,
    @Arg("limitTotal") limit: number
  ): Promise<DealsResponse> {
    const deals = await db.select().from(dbDeals).offset(offset).limit(limit);
    const totalCountResult = await db.select({ value: count() }).from(dbDeals);
    const totalCount = totalCountResult[0].value;

    return {
      deals,
      totalCount,
    };
  }
}
