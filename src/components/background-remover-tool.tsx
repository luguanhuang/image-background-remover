"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type Status = "idle" | "processing" | "success" | "error";

type ToolError = {
  message: string;
  details?: string;
};

type BackgroundRemoverToolProps = {
  isAuthenticated: boolean;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateImage(file: File): ToolError | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return {
      message: "文件格式不支持",
      details: "请上传 JPG、PNG 或 WebP 格式图片。",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      message: "文件过大",
      details: "当前版本仅支持 10MB 以内的图片。",
    };
  }

  return null;
}

export function BackgroundRemoverTool({
  isAuthenticated,
}: BackgroundRemoverToolProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<ToolError | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [originalUrl, resultUrl]);

  const statusLabel = useMemo(() => {
    if (!isAuthenticated) {
      return "请先使用 Google 登录，再开始上传图片并抠图。";
    }

    switch (status) {
      case "processing":
        return "正在处理中，请稍等...";
      case "success":
        return "抠图完成，可以预览或下载结果。";
      case "error":
        return error?.message ?? "处理失败，请稍后重试。";
      default:
        return selectedFile
          ? `已选择文件：${selectedFile.name}`
          : "上传一张图片后即可开始抠图。";
    }
  }, [error?.message, isAuthenticated, selectedFile, status]);

  const clearResult = () => {
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }
  };

  const resetSelection = () => {
    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
      setOriginalUrl(null);
    }
    clearResult();
    setSelectedFile(null);
    setStatus("idle");
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const applyFile = (file: File) => {
    if (!isAuthenticated) {
      setError({
        message: "请先登录",
        details: "登录 Google 账号后才能上传并处理图片。",
      });
      setStatus("error");
      return;
    }

    const validationError = validateImage(file);
    if (validationError) {
      resetSelection();
      setError(validationError);
      setStatus("error");
      return;
    }

    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
    }

    clearResult();
    setSelectedFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    setError(null);
    setStatus("idle");
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    applyFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    applyFile(file);
  };

  const handleRemoveBackground = async () => {
    if (!isAuthenticated) {
      setError({
        message: "请先登录",
        details: "登录 Google 账号后才能开始抠图。",
      });
      setStatus("error");
      return;
    }

    if (!selectedFile) {
      setError({
        message: "还没有选择图片",
        details: "请先上传一张图片，再开始抠图。",
      });
      setStatus("error");
      return;
    }

    const validationError = validateImage(selectedFile);
    if (validationError) {
      setError(validationError);
      setStatus("error");
      return;
    }

    setStatus("processing");
    setError(null);

    const formData = new FormData();
    formData.append("image_file", selectedFile);

    try {
      const response = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string; details?: string }
          | null;

        setError({
          message: data?.error ?? "抠图失败",
          details: data?.details ?? "当前图片暂时无法处理，请稍后再试。",
        });
        setStatus("error");
        return;
      }

      const blob = await response.blob();
      clearResult();
      const nextUrl = URL.createObjectURL(blob);
      setResultUrl(nextUrl);
      setStatus("success");
    } catch {
      setError({
        message: "网络异常",
        details: "请检查网络连接后重试。",
      });
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;

    const anchor = document.createElement("a");
    anchor.href = resultUrl;
    const fileName = selectedFile?.name.replace(/\.[^.]+$/, "") ?? "image";
    anchor.download = `${fileName}-transparent.png`;
    anchor.click();
  };

  return (
    <section
      id="tool"
      className="grid gap-6 rounded-[2rem] border border-black/5 bg-white/92 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:grid-cols-[1.1fr_0.9fr] md:p-8"
    >
      <div className="space-y-5">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            在线抠图体验版
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              上传图片后，一键完成去背景
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
              先上传原图，系统会自动处理并返回透明背景结果。你可以当场预览，确认无误后再下载 PNG。
            </p>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            为了控制额度和使用权限，这个工具现在需要先完成 Google 登录。
          </div>
        ) : null}

        <label
          onDragOver={(event) => {
            event.preventDefault();
            if (isAuthenticated) {
              setIsDragging(true);
            }
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex min-h-64 flex-col items-center justify-center rounded-[1.5rem] border border-dashed px-6 py-10 text-center transition ${
            !isAuthenticated
              ? "cursor-not-allowed border-slate-200 bg-slate-100 opacity-70"
              : isDragging
                ? "cursor-pointer border-sky-400 bg-sky-50"
                : "cursor-pointer border-slate-300 bg-slate-50 hover:border-sky-300 hover:bg-sky-50/70"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={!isAuthenticated}
          />
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-xl text-white shadow-lg shadow-slate-900/15">
            ✦
          </div>
          <p className="text-lg font-semibold text-slate-900">拖拽图片到这里</p>
          <p className="mt-2 text-sm text-slate-600">或者点击上传本地图片</p>
          <p className="mt-6 text-xs text-slate-500">支持 JPG、PNG、WebP，单张不超过 10MB。</p>
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <div className="font-semibold text-slate-900">上传格式</div>
            <div className="mt-1">JPG / PNG / WebP</div>
          </div>
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <div className="font-semibold text-slate-900">大小限制</div>
            <div className="mt-1">最大 10MB</div>
          </div>
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <div className="font-semibold text-slate-900">输出文件</div>
            <div className="mt-1">透明背景 PNG</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={!isAuthenticated}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            选择图片
          </button>
          <button
            type="button"
            onClick={handleRemoveBackground}
            disabled={!selectedFile || status === "processing" || !isAuthenticated}
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-300"
          >
            {status === "processing" ? "正在抠图..." : "开始抠图"}
          </button>
          {selectedFile ? (
            <button
              type="button"
              onClick={resetSelection}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
            >
              重新选择
            </button>
          ) : null}
          {resultUrl ? (
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
            >
              下载 PNG
            </button>
          ) : null}
        </div>

        <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <p className="font-medium text-slate-900">当前状态</p>
          <p className="mt-1">{statusLabel}</p>
          {selectedFile ? (
            <p className="mt-2 text-xs text-slate-500">
              {selectedFile.name} · {formatFileSize(selectedFile.size)}
            </p>
          ) : null}
          {error?.details ? (
            <p className="mt-2 text-xs text-rose-600">{error.details}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-sm font-semibold text-slate-900">原图预览</p>
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[1.25rem] border border-slate-200 bg-[linear-gradient(45deg,#f8fafc_25%,#eef2ff_25%,#eef2ff_50%,#f8fafc_50%,#f8fafc_75%,#eef2ff_75%,#eef2ff_100%)] bg-[length:24px_24px]">
            {originalUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={originalUrl}
                  alt="原图预览"
                  className="h-full w-full object-contain"
                />
              </>
            ) : (
              <div className="px-6 text-center text-sm text-slate-500">
                上传图片后，这里会显示原图。
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-sm font-semibold text-slate-900">抠图结果</p>
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[1.25rem] border border-slate-200 bg-[linear-gradient(45deg,#ffffff_25%,#e2e8f0_25%,#e2e8f0_50%,#ffffff_50%,#ffffff_75%,#e2e8f0_75%,#e2e8f0_100%)] bg-[length:24px_24px]">
            {resultUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resultUrl}
                  alt="抠图结果预览"
                  className="h-full w-full object-contain"
                />
              </>
            ) : (
              <div className="px-6 text-center text-sm text-slate-500">
                处理完成后，这里会显示透明背景结果。
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
