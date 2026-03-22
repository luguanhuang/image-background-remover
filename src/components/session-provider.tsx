"use client";

import {SessionProvider} from "next-auth/react";
import type {Session} from "next-auth";

type AppSessionProviderProps = {
  children: React.ReactNode;
  session: Session | null;
};

export function AppSessionProvider({
  children,
  session,
}: AppSessionProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
