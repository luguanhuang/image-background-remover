import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function jsonError(status: number, error: string, details?: string) {
  return NextResponse.json({ error, details }, { status });
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.REMOVE_BG_API_KEY;

  if (!apiKey) {
    return jsonError(
      500,
      "Server configuration error.",
      "REMOVE_BG_API_KEY is not configured.",
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image_file");

    if (!(file instanceof File)) {
      return jsonError(
        400,
        "Missing image.",
        "Please upload an image file using the image_file field.",
      );
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      return jsonError(
        400,
        "Unsupported file format.",
        "Supported formats are JPG, PNG, and WebP.",
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return jsonError(
        400,
        "File is too large.",
        "The current MVP supports images up to 10MB.",
      );
    }

    const upstreamForm = new FormData();
    upstreamForm.append("image_file", file, file.name || "upload-image");
    upstreamForm.append("size", "auto");
    upstreamForm.append("format", "png");

    const upstreamResponse = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: upstreamForm,
      cache: "no-store",
    });

    if (!upstreamResponse.ok) {
      let details = `remove.bg returned status ${upstreamResponse.status}.`;

      const contentType = upstreamResponse.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const errorData = (await upstreamResponse.json().catch(() => null)) as
          | { errors?: Array<{ title?: string; detail?: string }> }
          | null;
        const firstError = errorData?.errors?.[0];
        if (firstError?.title || firstError?.detail) {
          details = [firstError.title, firstError.detail].filter(Boolean).join(" — ");
        }
      } else {
        const text = await upstreamResponse.text().catch(() => "");
        if (text) {
          details = text.slice(0, 300);
        }
      }

      return jsonError(502, "Background removal failed.", details);
    }

    const arrayBuffer = await upstreamResponse.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'inline; filename="removed-background.png"',
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return jsonError(
      500,
      "Unexpected server error.",
      "The image could not be processed right now. Please try again.",
    );
  }
}
