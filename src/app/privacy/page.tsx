import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Image Background Remover",
  description:
    "Learn how Image Background Remover handles uploaded images, temporary processing, and third-party background removal via remove.bg.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900 md:px-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
              Privacy Policy
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              How uploaded images are handled
            </h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Back to tool
          </Link>
        </div>

        <div className="mt-8 space-y-8 text-sm leading-7 text-slate-600">
          <section>
            <h2 className="text-xl font-semibold text-slate-950">Summary</h2>
            <p className="mt-3">
              This application does not persistently store the images you upload.
              Files are handled only during the active request and are sent to
              remove.bg to generate the transparent PNG result.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">What happens when you upload an image?</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Your image is selected in the browser and previewed locally.</li>
              <li>The image is sent to this app&apos;s server endpoint for validation and forwarding.</li>
              <li>The server sends the image to remove.bg for background removal.</li>
              <li>The processed PNG is returned to your browser for preview and download.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">What this app does not do</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>It does not store your original image in a database.</li>
              <li>It does not upload your image to object storage or a CDN bucket.</li>
              <li>It does not keep a persistent history of processed images.</li>
              <li>It does not use uploaded images for model training.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">Third-party processing</h2>
            <p className="mt-3">
              Background removal is performed by <strong>remove.bg</strong>. That means
              your image is transmitted to remove.bg during processing. If you use
              this tool, you should assume remove.bg receives the uploaded file in
              order to generate the result.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">Technical safeguards</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Supported formats are limited to JPG, PNG, and WebP.</li>
              <li>Maximum upload size is 10MB for this MVP.</li>
              <li>Processed responses are returned with <code>Cache-Control: no-store</code>.</li>
              <li>API credentials stay on the server and are never exposed to the browser.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-950">Contact and updates</h2>
            <p className="mt-3">
              This policy describes the current MVP implementation. If the product
              later adds accounts, billing, analytics, or persistent storage, the
              privacy policy should be updated accordingly.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
