import Image from "next/image";
import Link from "next/link";
import { BackgroundRemoverTool } from "@/components/background-remover-tool";

const features = [
  {
    title: "一键抠图",
    description:
      "上传图片后自动去背景，适合商品图、头像、海报素材和内容封面，流程简单直接。",
  },
  {
    title: "透明 PNG 下载",
    description:
      "处理完成后可直接预览并下载透明背景 PNG，方便继续做设计、排版和二次创作。",
  },
  {
    title: "轻量快速",
    description:
      "当前版本聚焦最核心的单图处理体验，不做复杂账号系统，打开页面就能开始使用。",
  },
];

const steps = [
  {
    title: "上传图片",
    description: "支持 JPG、PNG、WebP，单张图片大小最高 10MB。",
  },
  {
    title: "自动去背景",
    description: "服务端调用 remove.bg 处理图片，并返回透明背景结果。",
  },
  {
    title: "预览并下载",
    description: "处理完成后可直接在页面查看效果，再保存透明 PNG。",
  },
];

const useCases = [
  "电商商品主图与详情图",
  "个人头像与职业形象照",
  "海报、PPT、短视频封面素材",
  "社媒内容配图与广告创意",
];

const faqs = [
  {
    question: "支持哪些图片格式？",
    answer: "目前支持 JPG、JPEG、PNG、WebP，单张图片大小不超过 10MB。",
  },
  {
    question: "会保存我上传的图片吗？",
    answer:
      "当前 MVP 不会长期保存上传图和处理结果，图片仅在请求处理过程中使用。",
  },
  {
    question: "为什么有时会处理失败？",
    answer:
      "通常是因为文件格式不支持、图片太大、网络波动，或 remove.bg 上游接口暂时异常。",
  },
  {
    question: "适合哪些使用场景？",
    answer:
      "适合商品抠图、人物头像、海报元素提取、封面素材制作等需要透明背景的场景。",
  },
];

export default function Home() {
  return (
    <main className="bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_28%),linear-gradient(180deg,#f8fbff_0%,#ffffff_46%,#f8fafc_100%)] text-slate-900">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pb-20 pt-8 md:px-8 lg:px-10">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
              PixelCut Lite
            </p>
            <p className="mt-2 text-sm text-slate-600">
              更像正式产品页的在线抠图工具，打开就能上传，处理后直接下载透明 PNG。
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <a href="#tool" className="transition hover:text-slate-950">
              开始抠图
            </a>
            <a href="#how-it-works" className="transition hover:text-slate-950">
              使用流程
            </a>
            <a href="#faq" className="transition hover:text-slate-950">
              常见问题
            </a>
            <Link href="/privacy" className="transition hover:text-slate-950">
              隐私说明
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
            >
              帮助中心
            </Link>
          </nav>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-800 shadow-sm">
              在线智能去背景 · 实时预览 · 透明 PNG 下载
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              一键去除图片背景，让商品图和人物图更干净
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              上传一张图片，自动完成抠图，几秒内返回透明背景 PNG。
              适合电商主图、头像、封面素材、海报元素和各类营销内容制作。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#tool"
                className="inline-flex items-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                立即上传图片
              </a>
              <Link
                href="/privacy"
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
              >
                查看隐私说明
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                <div className="text-sm font-semibold text-slate-950">支持格式</div>
                <div className="mt-1 text-sm text-slate-600">JPG / PNG / WebP</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                <div className="text-sm font-semibold text-slate-950">最大大小</div>
                <div className="mt-1 text-sm text-slate-600">单张 10MB</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                <div className="text-sm font-semibold text-slate-950">输出结果</div>
                <div className="mt-1 text-sm text-slate-600">透明背景 PNG</div>
              </div>
            </div>
          </div>

          <div className="relative rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="absolute -right-4 -top-4 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 shadow-sm">
              示例效果
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 shadow-sm">
                <div className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900">
                  原图
                </div>
                <div className="p-4">
                  <div className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white">
                    <Image
                      src="/hero-before.svg"
                      alt="抠图前示例"
                      width={1200}
                      height={900}
                      className="h-auto w-full"
                      priority
                    />
                  </div>
                </div>
              </article>
              <article className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 shadow-sm">
                <div className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900">
                  去背景后
                </div>
                <div className="p-4">
                  <div className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white">
                    <Image
                      src="/hero-after.svg"
                      alt="抠图后示例"
                      width={1200}
                      height={900}
                      className="h-auto w-full"
                      priority
                    />
                  </div>
                </div>
              </article>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <div className="font-semibold text-slate-900">边缘更干净</div>
                <div className="mt-1">适合二次排版、商品图展示和海报设计。</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <div className="font-semibold text-slate-900">流程更直接</div>
                <div className="mt-1">上传、处理、预览、下载，4 步完成。</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <div className="font-semibold text-slate-900">没有登录门槛</div>
                <div className="mt-1">当前 MVP 不做复杂账号流程，体验更轻。</div>
              </div>
            </div>
          </div>
        </section>

        <BackgroundRemoverTool />

        <section className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-950">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
              适用场景
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              适合需要高频抠图的常见内容工作流
            </h2>
            <div className="mt-6 grid gap-3">
              {useCases.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    OK
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <section
            id="how-it-works"
            className="rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-8 text-white shadow-sm md:px-8 md:py-10"
          >
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
                使用流程
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                三步完成在线抠图
              </h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-400/20 text-sm font-semibold text-sky-200">
                    0{index + 1}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{step.description}</p>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section
          id="faq"
          className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm md:grid-cols-[0.8fr_1.2fr] md:p-8"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
              常见问题
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              关于这个在线抠图工具，你可能想先了解这些
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              如果你想进一步了解数据处理方式和能力边界，可以继续查看 FAQ 和隐私说明页。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/faq"
                className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                打开 FAQ
              </Link>
              <Link
                href="/privacy"
                className="inline-flex items-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
              >
                查看隐私说明
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4"
              >
                <summary className="cursor-pointer list-none text-base font-semibold text-slate-950 marker:content-none">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-sky-200 bg-[linear-gradient(135deg,#f0f9ff_0%,#ffffff_55%,#eef2ff_100%)] px-6 py-8 md:px-8 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                现在开始
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                上传一张图片，马上试试实际抠图效果
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                当前版本先把最关键的体验做完整：上传、去背景、预览、下载，不加多余步骤。
              </p>
            </div>
            <a
              href="#tool"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              立即开始
            </a>
          </div>
        </section>

        <footer className="flex flex-col gap-4 border-t border-slate-200 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 PixelCut Lite. 一个轻量、直接、好上手的在线抠图 MVP。</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="transition hover:text-slate-900">
              隐私说明
            </Link>
            <Link href="/faq" className="transition hover:text-slate-900">
              FAQ
            </Link>
            <a href="#tool" className="transition hover:text-slate-900">
              开始抠图
            </a>
          </div>
        </footer>
      </section>
    </main>
  );
}
