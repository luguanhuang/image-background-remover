import { NextRequest, NextResponse } from "next/server";
import {
  createPayPalOrder,
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
      | { packKey?: string }
      | null;

    if (!body?.packKey) {
      return jsonError(400, "Missing credit pack.", "Please choose a valid credit pack.");
    }

    const order = await createPayPalOrder(body.packKey as never);

    if (!order.approveUrl) {
      return jsonError(
        502,
        "PayPal approval link missing.",
        "PayPal did not return an approval URL for this order.",
      );
    }

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      approveUrl: order.approveUrl,
      pack: order.pack,
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
      "Could not create the PayPal order right now.",
    );
  }
}
