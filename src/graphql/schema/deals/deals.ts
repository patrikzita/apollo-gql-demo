import { ObjectType, Field, ID } from "type-graphql";

@ObjectType({ description: "Deal Object" })
export class Deal {
  @Field()
  id: string;
  @Field()
  title: string;
  @Field()
  description: string;
  @Field()
  isActive: boolean;
}

@ObjectType()
export class DealsResponse {
  @Field(() => [Deal])
  deals: Deal[];

  @Field()
  totalCount: number;
}
