import { ApolloError } from "apollo-server-micro";
import { Field, ObjectType, Query, Resolver } from "type-graphql";

@ObjectType()
class Product {
  @Field()
  name: string;

  @Field({ nullable: true })
  price: number;
}

@Resolver(Product)
export class ProductResolver {
  private productItems = [
    { name: "Product A", price: 100 },
    { name: "Product B", price: 200 },
    { name: "Product C", price: 200 },
    { name: "Product D", price: 200 },
    { name: "Product E", price: 200 },
    { name: "Product F", price: 200 },
  ];

  @Query(() => [Product!])
  async products(): Promise<Product[]> {
    return this.productItems.map((product) => {
      if (Math.random() < 0.3) {
        throw new ApolloError("Custom error from products");
      }
      return product;
    });
  }
}
