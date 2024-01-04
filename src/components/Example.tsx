import { useCreateUserMutation, useGetUsersQuery } from "@/generated/graphql";
import AnotherChildren from "./AnotherChildren";

export default function Example() {
  const { data, refetch } = useGetUsersQuery();

  const [mutation] = useCreateUserMutation();
  console.log("Example provedl rerender");
  return (
    <div className="border">
      <p>Hi, I am children component</p>
      <button onClick={() => refetch()}>Refetch users from children</button>
      <button
        className="bg-blue-300"
        onClick={() =>
          mutation({
            variables: {
              createUserId: "888888888",
              name: "Rerender",
            },
          })
        }
      >
        Add user
      </button>

      <pre>{JSON.stringify(data, null, 2)}</pre>
      <AnotherChildren />
    </div>
  );
}
