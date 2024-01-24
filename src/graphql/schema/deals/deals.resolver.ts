import { db } from "@/db/db";
import { deals as dbDeals } from "@/db/schema";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import {
  Deal,
  DealConnection,
  DealDeleteResponse,
  DealsResponse,
} from "./deals";
import { count, eq, gt } from "drizzle-orm";
import { GraphQLError } from "graphql";

@Resolver(Deal)
export class DealResolver {
  @Query(() => [Deal])
  async deals(): Promise<Deal[]> {
    const deals = db.select().from(dbDeals).all();
    return deals;
  }

  @Mutation(() => Deal)
  async createDeal(
    @Arg("title") title: string,
    @Arg("description", { nullable: true }) description: string,
    @Arg("isActive", { nullable: true }) isActive: boolean
  ): Promise<Deal> {
    const newDeal = await db
      .insert(dbDeals)
      .values({ title, description, isActive })
      .returning();

    await new Promise((resolve) => setTimeout(resolve, 5000));

    return newDeal[0];
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

  @Query(() => DealsResponse)
  async dealsOffsetWithFilter(
    @Arg("offset") offset: number,
    @Arg("limit") limit: number,
    @Arg("isActive", { nullable: true }) isActive?: boolean
  ): Promise<DealsResponse> {
    let dealsQueryBuilder = db
      .select()
      .from(dbDeals)
      .$dynamic()
      .offset(offset)
      .limit(limit);
    let totalCountQueryBuilder = db
      .select({ value: count() })
      .from(dbDeals)
      .$dynamic();

    if (isActive !== undefined) {
      dealsQueryBuilder = dealsQueryBuilder.where(
        eq(dbDeals.isActive, isActive)
      );
      totalCountQueryBuilder = totalCountQueryBuilder.where(
        eq(dbDeals.isActive, isActive)
      );
    }

    const deals = await dealsQueryBuilder;
    const totalCountResult = await totalCountQueryBuilder;
    const totalCount = totalCountResult[0].value;

    return {
      deals,
      totalCount,
    };
  }

  @Query(() => DealConnection)
  async cursorPaginatedDeals(
    @Arg("afterCursor", { nullable: true }) afterCursor: number,
    @Arg("limit", { defaultValue: 10 }) limit: number
  ): Promise<DealConnection> {
    let queryBuilder = db
      .select()
      .from(dbDeals)
      .$dynamic()
      .limit(limit + 1);

    if (afterCursor) {
      queryBuilder = queryBuilder.where(gt(dbDeals.id, afterCursor));
    }

    const deals = await queryBuilder;
    const hasNextPage = deals.length > limit;
    const edges = deals.slice(0, limit).map((deal) => ({
      node: deal,
      cursor: deal.id,
    }));

    return {
      edges,
      pageInfo: {
        hasNextPage,
        endCursor: hasNextPage ? edges[edges.length - 1].cursor : null,
      },
    };
  }
  @Mutation(() => DealDeleteResponse)
  async deleteDeal(@Arg("id") id: number): Promise<DealDeleteResponse> {
    const deletedUserIds = await db
      .delete(dbDeals)
      .where(eq(dbDeals.id, id))
      .returning({ deletedId: dbDeals.id });

    return deletedUserIds[0];
  }
}
