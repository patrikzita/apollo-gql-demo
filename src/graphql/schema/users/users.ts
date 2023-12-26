import { ObjectType, Field, ID } from "type-graphql";

@ObjectType({ description: "User object" })
export class User {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;
}
