import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
class DogAttribute {
  @Field(() => ID)
  key: string;

  @Field(() => String)
  value: string;
}

@ObjectType({ description: "Dog object" })
export class Dog {
  @Field()
  name: string;

  @Field(() => [DogAttribute])
  attributes: DogAttribute[];

  @Field(() => [String])
  description: string[];

  @Field(() => String)
  image: string;

  @Field(() => Number)
  ageInWeeks: number;

  @Field(() => String)
  sex: string;

  @Field(() => String)
  breed: string;

  @Field(() => String)
  color: string;

  @Field(() => Number)
  fee: number;

  @Field(() => Number)
  weight: number;

  @Field(() => String)
  availableDate: string;
}
