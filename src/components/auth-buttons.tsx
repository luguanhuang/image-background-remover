"use client";

import {useTransition} from "react";
import {signIn, signOut} from "next-auth/react";

type AuthButtonsProps = {
  isAuthenticated: boolean;
  userName?: string | null;
  userEmail?: string | null;
};

export function AuthButtons({
  isAuthenticated,
  userName,
  userEmail,
}: AuthButtonsProps) {
  const [isPending, startTransition] = useTransition();

  const handleSignIn = () => {
    startTransition(() => {
      void signIn("google", {callbackUrl: "/"});
    });
  };

  const handleSignOut = () => {
    startTransition(() => {
      void signOut({callbackUrl: "/"});
    });
  };

  if (isAuthenticated) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          <span className="font-semibold">已登录</span>
          {userName || userEmail ? ` · ${userName ?? userEmail}` : ""}
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isPending}
          className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "处理中..." : "退出登录"}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={isPending}
      className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? "跳转中..." : "使用 Google 登录"}
    </button>
  );
}
