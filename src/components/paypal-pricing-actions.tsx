"use client";

import { useMemo, useState } from "react";

type CheckoutState = {
  loadingKey: string | null;
  error: string | null;
};

type OneTimePackKey = "pack-10" | "pack-50" | "pack-200";
type SubscriptionKey = "starter" | "pro";

type PayPalPricingActionsProps = {
  type: "free" | "subscription" | "credits";
  packKey?: OneTimePackKey;
  planKey?: SubscriptionKey;
  buttonLabel: string;
  href?: string;
  className?: string;
};

async function startCheckout(path: string, body: Record<string, string>) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => null)) as
    | { approveUrl?: string; error?: string; details?: string }
    | null;

  if (!response.ok) {
    throw new Error(data?.details || data?.error || "Checkout failed.");
  }

  if (!data?.approveUrl) {
    throw new Error("PayPal approval URL was not returned.");
  }

  window.location.href = data.approveUrl;
}

export function PayPalPricingActions({
  type,
  packKey,
  planKey,
  buttonLabel,
  href = "/",
  className,
}: PayPalPricingActionsProps) {
  const [state, setState] = useState<CheckoutState>({
    loadingKey: null,
    error: null,
  });

  const loadingLabel = useMemo(() => {
    if (type === "subscription") {
      return "Redirecting to PayPal...";
    }

    if (type === "credits") {
      return "Creating order...";
    }

    return "Opening...";
  }, [type]);

  if (type === "free") {
    return (
      <a
        href={href}
        className={className}
      >
        {buttonLabel}
      </a>
    );
  }

  const actionKey = packKey || planKey || type;

  const handleClick = async () => {
    setState({ loadingKey: actionKey, error: null });

    try {
      if (type === "credits" && packKey) {
        await startCheckout("/api/paypal/create-order", { packKey });
        return;
      }

      if (type === "subscription" && planKey) {
        await startCheckout("/api/paypal/create-subscription", { planKey });
        return;
      }

      throw new Error("Missing checkout configuration.");
    } catch (error) {
      setState({
        loadingKey: null,
        error: error instanceof Error ? error.message : "Checkout failed.",
      });
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={state.loadingKey === actionKey}
        className={className}
      >
        {state.loadingKey === actionKey ? loadingLabel : buttonLabel}
      </button>
      {state.error ? <p className="text-sm text-rose-600">{state.error}</p> : null}
    </div>
  );
}
