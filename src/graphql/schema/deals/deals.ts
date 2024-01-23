import { ObjectType, Field, ID } from "type-graphql";

@ObjectType({ description: "Deal Object" })
export class Deal {
  @Field(() => ID)
  id: number;
  @Field()
  title: string;
  @Field({ nullable: true })
  description: string;
  @Field({ nullable: true })
  isActive: boolean;
}

@ObjectType()
export class DealsResponse {
  @Field(() => [Deal])
  deals: Deal[];

  @Field()
  totalCount: number;
}

@ObjectType()
export class PageInfo {
  @Field()
  hasNextPage: boolean;

  @Field({ nullable: true })
  endCursor: number;
}

@ObjectType()
export class DealEdge {
  @Field(() => Deal)
  node: Deal;

  @Field()
  cursor: number;
}

@ObjectType()
export class DealConnection {
  @Field(() => [DealEdge])
  edges: DealEdge[];

  @Field()
  pageInfo: PageInfo;
}
@ObjectType()
export class DealDeleteResponse {
  @Field({ nullable: true })
  deletedId: number;
}
