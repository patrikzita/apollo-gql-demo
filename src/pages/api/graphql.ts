import "reflect-metadata";
import { ApolloServer } from "apollo-server-micro";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { UserResolver } from "@/graphql/schema/users/users.resolver";
import type { NextApiRequest, NextApiResponse } from "next";
import { DealResolver } from "@/graphql/schema/deals/deals.resolver";
import { ProductResolver } from "@/graphql/schema/product/product.resolver";
import { GlampResolver } from "@/graphql/schema/glamps/glamps.resolver";

export interface MyContext {
  req: NextApiRequest;
  res: NextApiResponse;
}

const schema = await buildSchema({
  resolvers: [ProductResolver, UserResolver, DealResolver, GlampResolver],
  nullableByDefault: true,
});

const server = new ApolloServer({
  schema,
  csrfPrevention: false,
  cache: "bounded",
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  context: ({ req, res }): MyContext => ({ req, res }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const startServer = server.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  await startServer;
  await server.createHandler({ path: "/api/graphql" })(req, res);
}
