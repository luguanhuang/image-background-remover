import { NextRequest, NextResponse } from "next/server";
import {
  createPayPalSubscription,
  PayPalApiError,
  PayPalConfigError,
} from "@/lib/paypal";

export const runtime = "nodejs";

function jsonError(status: number, error: string, details?: string) {
  return NextResponse.json({ error, details }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { planKey?: string }
      | null;

    if (!body?.planKey) {
      return jsonError(400, "Missing plan.", "Please choose a valid subscription plan.");
    }

    const subscription = await createPayPalSubscription(body.planKey as never);

    if (!subscription.approveUrl) {
      return jsonError(
        502,
        "PayPal approval link missing.",
        "PayPal did not return an approval URL for this subscription.",
      );
    }

    return NextResponse.json({
      subscriptionId: subscription.id,
      status: subscription.status,
      approveUrl: subscription.approveUrl,
      planId: subscription.planId,
    });
  } catch (error) {
    if (error instanceof PayPalConfigError) {
      return jsonError(500, error.message);
    }

    if (error instanceof PayPalApiError) {
      return jsonError(502, error.message, error.details);
    }

    return jsonError(
      500,
      "Unexpected server error.",
      "Could not create the PayPal subscription right now.",
    );
  }
}
