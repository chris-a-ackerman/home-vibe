import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans ">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16  sm:items-start">

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black ">
            HomeVibe Future Landing Page
          </h1>

          <Link href="/dashboard">
            <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-zinc-800 transition-colors">
              Go to Dashboard
            </button>
          </Link>
        </div>

      </main>
    </div>
  );
}
