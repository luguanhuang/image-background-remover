const PAYPAL_API_BASE = {
  sandbox: "https://api-m.sandbox.paypal.com",
  live: "https://api-m.paypal.com",
} as const;

export type CreditPackKey = "pack-10" | "pack-50" | "pack-200";
export type SubscriptionPlanKey = "starter" | "pro";

type PayPalLink = {
  href?: string;
  rel?: string;
  method?: string;
};

type PayPalApiErrorResponse = {
  name?: string;
  message?: string;
  details?: Array<{
    issue?: string;
    description?: string;
  }>;
};

export class PayPalConfigError extends Error {}
export class PayPalApiError extends Error {
  status: number;
  details?: string;

  constructor(message: string, status: number, details?: string) {
    super(message);
    this.name = "PayPalApiError";
    this.status = status;
    this.details = details;
  }
}

export const CREDIT_PACKS: Record<
  CreditPackKey,
  { credits: number; price: string; name: string }
> = {
  "pack-10": {
    credits: 10,
    price: process.env.PAYPAL_CREDIT_PACK_10_PRICE || "4.99",
    name: "10 Credits",
  },
  "pack-50": {
    credits: 50,
    price: process.env.PAYPAL_CREDIT_PACK_50_PRICE || "14.99",
    name: "50 Credits",
  },
  "pack-200": {
    credits: 200,
    price: process.env.PAYPAL_CREDIT_PACK_200_PRICE || "39.99",
    name: "200 Credits",
  },
};

const SUBSCRIPTION_PLAN_ENV: Record<SubscriptionPlanKey, string> = {
  starter: "PAYPAL_PLAN_STARTER_ID",
  pro: "PAYPAL_PLAN_PRO_ID",
};

export function getAppBaseUrl() {
  return (
    process.env.APP_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000"
  );
}

function getPayPalCredentials() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new PayPalConfigError(
      "PayPal credentials are missing. Configure PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.",
    );
  }

  return { clientId, clientSecret };
}

function getPayPalApiBaseUrl() {
  const mode = process.env.PAYPAL_ENV === "live" ? "live" : "sandbox";
  return PAYPAL_API_BASE[mode];
}

async function getPayPalAccessToken() {
  const { clientId, clientSecret } = getPayPalCredentials();
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${getPayPalApiBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new PayPalApiError(
      "Failed to authenticate with PayPal.",
      response.status,
      text.slice(0, 400),
    );
  }

  const data = (await response.json()) as { access_token?: string };

  if (!data.access_token) {
    throw new PayPalApiError(
      "PayPal did not return an access token.",
      502,
    );
  }

  return data.access_token;
}

async function paypalRequest<T>(path: string, init: RequestInit) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${getPayPalApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? ((await response.json().catch(() => null)) as T | PayPalApiErrorResponse | null)
    : null;

  if (!response.ok) {
    const errorData = data as PayPalApiErrorResponse | null;
    const details = errorData?.details?.[0];
    const detailText = [details?.issue, details?.description]
      .filter(Boolean)
      .join(" — ");

    throw new PayPalApiError(
      errorData?.message || "PayPal request failed.",
      response.status,
      detailText || errorData?.name,
    );
  }

  return data as T;
}

function findApprovalUrl(links?: PayPalLink[]) {
  return links?.find((link) =>
    ["approve", "payer-action", "approve_subscription"].includes(link.rel || ""),
  )?.href;
}

export function getCreditPack(packKey: string) {
  return CREDIT_PACKS[packKey as CreditPackKey] || null;
}

export function getSubscriptionPlanId(planKey: string) {
  const envKey = SUBSCRIPTION_PLAN_ENV[planKey as SubscriptionPlanKey];
  if (!envKey) {
    return null;
  }

  return process.env[envKey] || null;
}

export async function createPayPalOrder(packKey: CreditPackKey) {
  const pack = getCreditPack(packKey);

  if (!pack) {
    throw new PayPalConfigError("Unknown credit pack.");
  }

  const baseUrl = getAppBaseUrl();
  const body = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: packKey,
        description: `${pack.name} for Image Background Remover`,
        custom_id: `credits:${pack.credits}`,
        amount: {
          currency_code: "USD",
          value: pack.price,
        },
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: "Image Background Remover",
          user_action: "PAY_NOW",
          return_url: `${baseUrl}/checkout/success?flow=order&pack=${packKey}`,
          cancel_url: `${baseUrl}/checkout/cancel?flow=order&pack=${packKey}`,
        },
      },
    },
  };

  const data = await paypalRequest<{
    id: string;
    status: string;
    links?: PayPalLink[];
  }>("/v2/checkout/orders", {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify(body),
  });

  return {
    id: data.id,
    status: data.status,
    approveUrl: findApprovalUrl(data.links),
    pack,
  };
}

export async function capturePayPalOrder(orderId: string) {
  return paypalRequest<{
    id: string;
    status: string;
    payer?: {
      email_address?: string;
    };
    purchase_units?: Array<{
      reference_id?: string;
      payments?: {
        captures?: Array<{
          id?: string;
          status?: string;
          amount?: {
            currency_code?: string;
            value?: string;
          };
        }>;
      };
    }>;
  }>(`/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
  });
}

export async function createPayPalSubscription(planKey: SubscriptionPlanKey) {
  const planId = getSubscriptionPlanId(planKey);

  if (!planId) {
    throw new PayPalConfigError(
      `Missing PayPal plan id for ${planKey}. Configure ${SUBSCRIPTION_PLAN_ENV[planKey]}.`,
    );
  }

  const baseUrl = getAppBaseUrl();
  const data = await paypalRequest<{
    id: string;
    status: string;
    plan_id?: string;
    links?: PayPalLink[];
  }>("/v1/billing/subscriptions", {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      plan_id: planId,
      application_context: {
        brand_name: "Image Background Remover",
        user_action: "SUBSCRIBE_NOW",
        return_url: `${baseUrl}/checkout/success?flow=subscription&plan=${planKey}`,
        cancel_url: `${baseUrl}/checkout/cancel?flow=subscription&plan=${planKey}`,
      },
    }),
  });

  return {
    id: data.id,
    status: data.status,
    approveUrl: findApprovalUrl(data.links),
    planId,
  };
}
