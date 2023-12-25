import "reflect-metadata";
import { ApolloServer } from "apollo-server-micro";
import { buildSchema } from "type-graphql";
import { DogsResolver } from "@/graphql/schema/dogs/dogs.resolver";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

const schema = await buildSchema({
  resolvers: [DogsResolver],
});

const server = new ApolloServer({
  schema,
  csrfPrevention: false,
  cache: "bounded",
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const startServer = server.start();

export default async function handler(req, res) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  await startServer;
  await server.createHandler({ path: "/api/graphql" })(req, res);
}
