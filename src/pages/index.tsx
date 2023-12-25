import { useGetDogsQuery } from "@/generated/graphql";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data } = useGetDogsQuery();
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
