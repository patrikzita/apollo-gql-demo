import { Query, Resolver } from "type-graphql";
import { User } from "./users";
import { db } from "@/db/db";
import { users as dbUsers } from "@/db/schema";

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    const users = db.select().from(dbUsers).all();
    return users;
  }
}
