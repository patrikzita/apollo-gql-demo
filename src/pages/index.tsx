import Example from "@/components/Example";
import { GetUsersDocument, useGetUsersQuery } from "@/generated/graphql";
import { addApolloState, initializeApollo } from "@/utils/apolloClient";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data, refetch } = useGetUsersQuery();

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div>
        <button onClick={() => refetch()}>Refetch dogs from page</button>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
      <Example />
    </main>
  );
}

export async function getServerSideProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: GetUsersDocument,
  });

  return addApolloState(apolloClient, {
    props: {},
  });
}
