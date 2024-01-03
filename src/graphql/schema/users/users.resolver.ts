import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User } from "./users";
import { db } from "@/db/db";
import { users as dbUsers, users } from "@/db/schema";

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    const users = db.select().from(dbUsers).all();
    return users;
  }
  @Mutation(() => User)
  async createUser(
    @Arg("id") id: string,
    @Arg("name") name: string
  ): Promise<User> {
    const newUser = {
      name,
      id,
    };

    await db.insert(users).values(newUser);

    return newUser;
  }
}
