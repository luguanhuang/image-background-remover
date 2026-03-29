import { NextRequest, NextResponse } from "next/server";
import {
  capturePayPalOrder,
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
      | { orderId?: string }
      | null;

    if (!body?.orderId) {
      return jsonError(400, "Missing order ID.", "Please provide a PayPal order ID.");
    }

    const capture = await capturePayPalOrder(body.orderId);
    return NextResponse.json(capture);
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
      "Could not capture the PayPal order right now.",
    );
  }
}
