import { ObjectType, Field } from "type-graphql";

@ObjectType({ description: "Deal Object" })
export class Deal {
  @Field()
  id: number;
  @Field()
  title: string;
  @Field()
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
