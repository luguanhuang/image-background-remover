import Link from "next/link";

type SearchParams = Promise<{
  flow?: string;
  pack?: string;
  plan?: string;
}>;

export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const flowLabel = params.flow === "subscription" ? "subscription" : "payment";
  const selection = params.flow === "subscription" ? params.plan : params.pack;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(180deg,#f8fbff_0%,#ffffff_48%,#f8fafc_100%)] px-6 py-12 text-[#1f2a44] md:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#d8dfeb] bg-white p-8 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Checkout canceled
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
          Your PayPal {flowLabel} was not completed
        </h1>
        <p className="mt-5 text-base leading-7 text-[#5b6780]">
          No charge was finalized here. You can return to pricing and try again whenever you are ready.
        </p>

        <div className="mt-8 rounded-[1.5rem] border border-[#d8dfeb] bg-[#f7f9fc] p-5 text-sm leading-7 text-[#33415c]">
          <p><span className="font-semibold text-slate-900">Flow:</span> {flowLabel}</p>
          {selection ? <p><span className="font-semibold text-slate-900">Selection:</span> {selection}</p> : null}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/pricing"
            className="inline-flex items-center rounded-full bg-[#4f6ef7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#435fe8]"
          >
            Back to Pricing
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-[#1f2a44] transition hover:border-slate-400 hover:bg-slate-100"
          >
            Back to Tool
          </Link>
        </div>
      </div>
    </main>
  );
}
