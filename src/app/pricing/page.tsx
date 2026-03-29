import Link from "next/link";
import { PayPalPricingActions } from "@/components/paypal-pricing-actions";

export const metadata = {
  title: "Pricing | Image Background Remover",
  description:
    "Simple pricing for AI background removal with free credits, monthly plans, and one-time credit packs.",
};

const plans = [
  {
    name: "Free",
    price: "$0",
    subtitle: "Best for trying the product before you upgrade.",
    features: [
      "3 free HD background removals after sign-in",
      "Single image upload",
      "HD download",
      "Standard processing speed",
      "Results available for 24 hours",
    ],
    button: "Start Free with Google",
    highlight: false,
    type: "free" as const,
    href: "/",
  },
  {
    name: "Starter",
    price: "$9.90 / month",
    subtitle: "For light recurring use and occasional product images.",
    features: [
      "30 HD removals per month",
      "Single image upload",
      "HD download",
      "Standard processing speed",
      "7-day history",
      "Commercial use",
    ],
    button: "Choose Starter",
    highlight: false,
    type: "subscription" as const,
    planKey: "starter" as const,
  },
  {
    name: "Pro",
    price: "$19.90 / month",
    subtitle: "For sellers, creators, and teams with higher volume needs.",
    features: [
      "100 HD removals per month",
      "Priority processing",
      "Batch processing",
      "30-day history",
      "Higher upload size limits",
      "Commercial use",
      "Priority support",
    ],
    button: "Upgrade to Pro",
    highlight: true,
    type: "subscription" as const,
    planKey: "pro" as const,
  },
];

const creditPacks = [
  {
    name: "10 Credits",
    price: "$4.99",
    button: "Buy 10 Credits",
    packKey: "pack-10" as const,
  },
  {
    name: "50 Credits",
    price: "$14.99",
    button: "Buy 50 Credits",
    packKey: "pack-50" as const,
  },
  {
    name: "200 Credits",
    price: "$39.99",
    button: "Buy 200 Credits",
    packKey: "pack-200" as const,
  },
];

const billingRules = [
  "A credit is charged only when processing succeeds and a downloadable result is generated.",
  "Failed processing does not consume credits.",
  "Monthly subscriptions renew automatically unless canceled.",
  "Credit packs are one-time purchases and do not renew.",
  "Credit packs are valid for 12 months from purchase.",
  "Monthly plan credits are used first, then credit-pack credits.",
];

const primaryButtonClass =
  "inline-flex w-full items-center justify-center rounded-full bg-[#4f6ef7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#435fe8] disabled:cursor-not-allowed disabled:opacity-70";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(180deg,#f8fbff_0%,#ffffff_48%,#f8fafc_100%)] px-6 py-12 text-[#1f2a44] md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <section className="rounded-[2rem] border border-[#d8dfeb] bg-[#f7f9fc]/92 p-8 shadow-sm md:p-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                Pricing
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                Simple pricing for AI background removal
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#5b6780] md:text-lg">
                Start free with <span className="font-semibold text-slate-900">3 HD credits</span>{" "}
                after signing in with Google. Upgrade when you need more images,
                faster workflows, and longer history.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center rounded-full bg-[#4f6ef7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#435fe8]"
              >
                Start Free
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-[#1f2a44] transition hover:border-slate-400 hover:bg-slate-100"
              >
                View FAQ
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-[2rem] border p-7 shadow-sm ${
                plan.highlight
                  ? "border-slate-950 bg-slate-800 text-white"
                  : "border-slate-300 bg-slate-50/90"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">{plan.name}</h2>
                  <p
                    className={`mt-3 text-sm leading-6 ${
                      plan.highlight ? "text-slate-300" : "text-[#5b6780]"
                    }`}
                  >
                    {plan.subtitle}
                  </p>
                </div>
                {plan.highlight ? (
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
                    Most Popular
                  </span>
                ) : null}
              </div>

              <div className="mt-6 text-3xl font-semibold tracking-tight">{plan.price}</div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={`flex items-start gap-3 text-sm leading-6 ${
                      plan.highlight ? "text-slate-200" : "text-[#33415c]"
                    }`}
                  >
                    <span
                      className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
                        plan.highlight
                          ? "bg-white/10 text-sky-200"
                          : "bg-slate-800 text-white"
                      }`}
                    >
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <PayPalPricingActions
                  type={plan.type}
                  planKey={plan.planKey}
                  href={plan.href}
                  buttonLabel={plan.button}
                  className={primaryButtonClass}
                />
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-[2rem] border border-[#d8dfeb] bg-[#f7f9fc]/92 p-8 shadow-sm md:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
              Credit Packs
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Need flexibility? Buy credits only when you need them
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#5b6780] md:text-base">
              Perfect for occasional use. No subscription required.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {creditPacks.map((pack) => (
              <article
                key={pack.name}
                className="rounded-[1.75rem] border border-[#d8dfeb] bg-[#f7f9fc] p-6"
              >
                <h3 className="text-xl font-semibold text-slate-900">{pack.name}</h3>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                  {pack.price}
                </p>
                <div className="mt-6">
                  <PayPalPricingActions
                    type="credits"
                    packKey={pack.packKey}
                    buttonLabel={pack.button}
                    className={primaryButtonClass}
                  />
                </div>
              </article>
            ))}
          </div>

          <p className="mt-6 text-sm leading-7 text-[#5b6780]">
            Credits are valid for <span className="font-semibold text-slate-900">12 months</span>{" "}
            from purchase. Monthly plan credits are used first, then credit packs.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[2rem] border border-[#d8dfeb] bg-[#f7f9fc]/92 p-8 shadow-sm md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
              Why Upgrade
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Free is for testing. Paid plans are for real work.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#5b6780] md:text-base">
              Paid plans are built for users who need reliable, repeated background
              removal for ecommerce, content creation, and commercial workflows.
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-[#33415c]">
              <li>More HD removals</li>
              <li>Better support for repeated usage</li>
              <li>Longer access to history</li>
              <li>Batch-friendly workflows</li>
              <li>Better fit for commercial use</li>
            </ul>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-slate-800 p-8 text-white shadow-sm md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
              Billing Rules
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              How billing works
            </h2>
            <ul className="mt-6 space-y-4">
              {billingRules.map((rule) => (
                <li key={rule} className="flex items-start gap-3 text-sm leading-6 text-slate-200">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-sky-200">
                    ✓
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-[2rem] border border-sky-200 bg-[linear-gradient(135deg,#f0f9ff_0%,#ffffff_55%,#eef2ff_100%)] px-8 py-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                Start Free
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                Start free, upgrade only when you need more
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#5b6780] md:text-base">
                Sign in with Google and get 3 free HD credits to try the full experience.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center rounded-full bg-[#4f6ef7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#435fe8]"
              >
                Start Free
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-[#1f2a44] transition hover:border-slate-400 hover:bg-slate-100"
              >
                See FAQ
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
