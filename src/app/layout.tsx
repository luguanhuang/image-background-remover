import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Image Background Remover | Remove Background from Images Online",
    template: "%s | Image Background Remover",
  },
  description:
    "Remove background from images online in seconds. Upload a JPG, PNG, or WebP file, erase the background automatically, and download a transparent PNG.",
  keywords: [
    "image background remover",
    "remove background from image",
    "make image background transparent",
    "free background remover",
    "transparent png maker",
  ],
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Image Background Remover",
    description:
      "Upload an image, remove the background automatically, and download a transparent PNG.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Background Remover",
    description:
      "Fast online background removal for JPG, PNG, and WebP images.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
