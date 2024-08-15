import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div>home page</div>
      <Link
        href="/dash"
        className="bg-green-200 text-black p-2 m-2 w-fit rounded-lg"
      >
        dashboard
      </Link>
    </div>
  );
}
