import type { Metadata } from "next";
import { auth } from "@/auth";
import { AppSessionProvider } from "@/components/session-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Image Background Remover | Remove Background from Images Online",
    template: "%s | Image Background Remover",
  },
  description:
    "Remove background from images online in seconds. Sign in with Google, upload a JPG, PNG, or WebP file, erase the background automatically, and download a transparent PNG.",
  keywords: [
    "image background remover",
    "remove background from image",
    "make image background transparent",
    "google login background remover",
    "transparent png maker",
  ],
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Image Background Remover",
    description:
      "Sign in with Google, upload an image, remove the background automatically, and download a transparent PNG.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Background Remover",
    description:
      "Google-authenticated online background removal for JPG, PNG, and WebP images.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <AppSessionProvider session={session}>{children}</AppSessionProvider>
      </body>
    </html>
  );
}
