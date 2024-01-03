import { useCreateUserMutation, useGetUsersQuery } from "@/generated/graphql";

export default function Example() {
  const { data, refetch } = useGetUsersQuery();

  const [mutation] = useCreateUserMutation();
  console.log("provedu rerender");
  return (
    <div className="border">
      <p>Hi, I am children component</p>
      <button onClick={() => refetch()}>Refetch users from children</button>
      <button
        className="bg-blue-300"
        onClick={() =>
          mutation({ variables: { createUserId: "55", name: "Jožinek123" } })
        }
      >
        Add user
      </button>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
