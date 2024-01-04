import { useCreateUserMutation, useGetUsersQuery } from "@/generated/graphql";

export default function AnotherChildren() {
  const { data, refetch } = useGetUsersQuery();
  console.log("AnotherChildren provedl rerender");

  return (
    <div className="border border-cyan-600">
      <p>Hi, I am children component</p>
      <button onClick={() => refetch()}>
        Refetch users from children children
      </button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
