import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-white px-6 py-12">
      <div className="grid w-full max-w-7xl grid-cols-1 items-center gap-10 md:grid-cols-2">
        {/* Left Side: Brand + Abstract Art */}
        <div className="flex flex-col items-start justify-center">
          <h1 className="mb-4 text-6xl leading-tight font-extrabold text-gray-800">
            MELDify
          </h1>
          <p className="mb-6 text-xl text-gray-600">
            Transform videos into meaningful emotion and sentiment insights.
          </p>
          <Link href="/login">
            <button className="rounded-xl px-6 py-3 text-lg shadow-lg">
              Try it out
            </button>
          </Link>
        </div>

        {/* Right Side: Abstract Art or Illustration */}
          <Image
            src="/hero.png"
            alt="Abstract emotional analysis art"
            width={1000}
            height={800}
            priority
          />
        </div>
      </div>
  );
}
