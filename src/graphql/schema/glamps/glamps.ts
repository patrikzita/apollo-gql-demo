import { ObjectType, Field, ID, Float, Int } from "type-graphql";

@ObjectType({ description: "Glamp Object" })
export class Glamp {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  type: string;

  @Field(() => Float)
  price: number;

  @Field()
  availableFrom: string;

  @Field()
  availableTo: string;

  @Field(() => Int)
  adultCapacity: number;

  @Field(() => Int)
  childCapacity: number;

  @Field()
  isLuxury: boolean;
}

@ObjectType()
export class GlampsPageInfo {
  @Field()
  hasNextPage: boolean;

  @Field({ nullable: true })
  total: number;
}

@ObjectType()
export class GlampsResponse {
  @Field(() => [Glamp])
  glamps: Glamp[];

  @Field()
  pageInfo: GlampsPageInfo;
}
