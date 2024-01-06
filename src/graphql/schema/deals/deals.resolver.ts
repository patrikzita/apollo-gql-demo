import { db } from "@/db/db";
import { deals as dbDeals } from "@/db/schema";
import { Query, Resolver } from "type-graphql";
import { Deal } from "./deals";

@Resolver(Deal)
export class DealResolver {
  @Query(() => [Deal])
  async deals(): Promise<Deal[]> {
    const deals = db.select().from(dbDeals).all();
    return deals;
  }
}
