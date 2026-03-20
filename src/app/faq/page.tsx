import Link from "next/link";

export const metadata = {
  title: "FAQ | Image Background Remover",
  description:
    "Answers to common questions about file formats, privacy, downloads, and how this image background remover works.",
};

const faqs = [
  {
    question: "What image formats are supported?",
    answer: "This MVP supports JPG, JPEG, PNG, and WebP uploads up to 10MB.",
  },
  {
    question: "What do I get after processing?",
    answer:
      "The tool returns a transparent PNG image so you can use it in designs, presentations, product listings, or social media assets.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No. This MVP is designed to be as simple as possible, so there is no account creation or login requirement.",
  },
  {
    question: "Do you store uploaded images?",
    answer:
      "The app does not persistently store uploaded or processed images. Files are handled in memory and sent to remove.bg during processing.",
  },
  {
    question: "Why might background removal fail?",
    answer:
      "The most common causes are unsupported formats, files larger than 10MB, network interruptions, or temporary remove.bg API issues.",
  },
  {
    question: "Can I use this for product photos?",
    answer:
      "Yes. This MVP works for product photos, profile pictures, logos, and other common use cases where you need a clean transparent background.",
  },
  {
    question: "Is there batch processing?",
    answer:
      "Not in the MVP. This version is intentionally limited to single-image processing so the core workflow can be validated first.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900 md:px-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
              FAQ
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              Questions about this image background remover
            </h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Back to tool
          </Link>
        </div>

        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4"
            >
              <summary className="cursor-pointer list-none text-base font-semibold text-slate-950">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}
