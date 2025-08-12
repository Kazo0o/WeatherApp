import Link from "next/link";

export default async function Home() {
  return (
    <main>
      <h1 className="text-2xl text-center">Welcome to Weather Analytics</h1>
      <p className="mt-5">Here are some useful links:</p>
      <ul>
        <li className="underline text-blue-400">
          <Link href="weather">View Weather</Link>
        </li>
        <li className="underline text-blue-400">
        <Link href="analyse">View Analytics</Link>
        </li>
      </ul>
    </main>
  );
}
