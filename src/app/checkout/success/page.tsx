import Link from "next/link";
import { getCreditPack } from "@/lib/paypal";

type SearchParams = Promise<{
  token?: string;
  PayerID?: string;
  flow?: string;
  pack?: string;
  subscription_id?: string;
  plan?: string;
}>;

async function captureOrder(orderId: string) {
  const baseUrl =
    process.env.APP_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/paypal/capture-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
      cache: "no-store",
    });

    return (await response.json().catch(() => null)) as
      | {
          status?: string;
          error?: string;
          details?: string;
          purchase_units?: Array<{
            payments?: {
              captures?: Array<{
                id?: string;
                amount?: {
                  value?: string;
                  currency_code?: string;
                };
              }>;
            };
          }>;
        }
      | null;
  } catch {
    return {
      error: "Could not confirm your payment right now.",
      details: "Please verify the order in your PayPal dashboard.",
    };
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const flow = params.flow || (params.subscription_id ? "subscription" : "order");

  if (flow === "subscription") {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(180deg,#f8fbff_0%,#ffffff_48%,#f8fafc_100%)] px-6 py-12 text-[#1f2a44] md:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-emerald-200 bg-white p-8 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Subscription started
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
            PayPal approved your subscription
          </h1>
          <p className="mt-5 text-base leading-7 text-[#5b6780]">
            Your subscription approval flow completed in PayPal sandbox.
            The recurring entitlement step is still app-specific and should be
            finalized when you wire subscription business logic and webhooks.
          </p>

          <div className="mt-8 rounded-[1.5rem] border border-[#d8dfeb] bg-[#f7f9fc] p-5 text-sm leading-7 text-[#33415c]">
            <p><span className="font-semibold text-slate-900">Subscription ID:</span> {params.subscription_id || "Not provided"}</p>
            <p><span className="font-semibold text-slate-900">Selected plan:</span> {params.plan || "Unknown"}</p>
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

  const orderId = params.token;
  const capture = orderId ? await captureOrder(orderId) : null;
  const pack = params.pack ? getCreditPack(params.pack) : null;
  const payment = capture?.purchase_units?.[0]?.payments?.captures?.[0];
  const completed = capture?.status === "COMPLETED";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(180deg,#f8fbff_0%,#ffffff_48%,#f8fafc_100%)] px-6 py-12 text-[#1f2a44] md:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#d8dfeb] bg-white p-8 shadow-sm md:p-10">
        <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${completed ? "text-emerald-700" : "text-amber-700"}`}>
          {completed ? "Payment captured" : "Payment confirmation pending"}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
          {completed ? "Your PayPal payment was successful" : "We are still confirming your PayPal payment"}
        </h1>
        <p className="mt-5 text-base leading-7 text-[#5b6780]">
          {completed
            ? "The one-time order was captured successfully. The next step is to connect this order to your in-app credit ledger so purchased credits are granted automatically."
            : capture?.details || capture?.error || "The order returned from PayPal, but capture has not been confirmed yet."}
        </p>

        <div className="mt-8 rounded-[1.5rem] border border-[#d8dfeb] bg-[#f7f9fc] p-5 text-sm leading-7 text-[#33415c]">
          <p><span className="font-semibold text-slate-900">Order ID:</span> {orderId || "Missing"}</p>
          <p><span className="font-semibold text-slate-900">Pack:</span> {pack ? `${pack.name} (${pack.credits} credits)` : params.pack || "Unknown"}</p>
          <p><span className="font-semibold text-slate-900">Capture status:</span> {capture?.status || "Unknown"}</p>
          {payment?.id ? <p><span className="font-semibold text-slate-900">Capture ID:</span> {payment.id}</p> : null}
          {payment?.amount?.value ? (
            <p>
              <span className="font-semibold text-slate-900">Amount:</span>{" "}
              {payment.amount.currency_code || "USD"} {payment.amount.value}
            </p>
          ) : null}
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
