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
