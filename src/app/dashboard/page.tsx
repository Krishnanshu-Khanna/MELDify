import type { ApiQuota } from "@prisma/client";
import { redirect } from "next/navigation";
import CodeExamples from "~/components/client/code-examples";
import CopyButton from "~/components/client/copy-button";
import { Inference } from "~/components/client/Inference";
import { SignOutButton } from "~/components/client/signout";
import { auth } from "~/server/auth";
import { db } from "~/server/db"; // assumed correctly typed Prisma client

export default async function HomePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Type safety added by declaring the expected return type explicitly
  const apiQuota: Pick<ApiQuota, "secretKey" | "requestsUsed" | "maxRequests"> | null =
    await db.apiQuota.findFirst({
      where: { userId: session.user.id },
      select: {
        secretKey: true,
        requestsUsed: true,
        maxRequests: true,
      },
    });

  if (!apiQuota) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-red-600">No quota found for this user.</p>
      </div>
    );
  }

  const usagePercentage = Math.min(
    (apiQuota.requestsUsed / apiQuota.maxRequests) * 100,
    100
  );

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex h-16 items-center justify-between border-b border-gray-200 px-10">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-800 text-white">
            MD
          </div>
          <span className="text-lg font-medium">MELDify-Sentiment Analysis</span>
        </div>
        <SignOutButton />
      </nav>

      <main className="flex min-h-screen w-full flex-col gap-6 p-4 sm:p-10 md:flex-row">
        <Inference quota={{ secretKey: apiQuota.secretKey }} />

        <div className="hidden border-l border-slate-200 md:block"></div>
{/* right side api keys */}
        <div className="flex h-fit w-full flex-col gap-3 md:w-1/2">
          <h2 className="text-lg font-medium text-slate-800">API</h2>

          <div className="bg-opacity-70 mt-3 flex flex-col rounded-xl bg-gray-100 p-4">
            <span className="text-sm">Secret key</span>
            <span className="text-sm text-gray-500">
              Use this key to authorize your requests. Keep it secret.
            </span>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm">Key</span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-full max-w-[200px] overflow-x-auto rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 sm:w-auto">
                  {apiQuota.secretKey}
                </span>
                <CopyButton text={apiQuota.secretKey} />
              </div>
            </div>
          </div>
{/* monthly quotas and codes  */}
          <div className="bg-opacity-70 mt-3 flex flex-col rounded-xl bg-gray-100 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm">Monthly quota</span>
              <span className="text-sm text-gray-500">
                {apiQuota.requestsUsed} / {apiQuota.maxRequests} requests
              </span>
            </div>
            <div className="mt-1 h-1 w-full rounded-full bg-gray-200">
              <div
                style={{
                  width: `${usagePercentage}%`,
                }}
                className="h-1 rounded-full bg-gray-800 transition-all"
              />
            </div>
          </div>

          <CodeExamples />
        </div>
      </main>
    </div>
  );
}

