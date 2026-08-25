"use client";

import { useEffect } from "react";

export function CanonicalizeUrl({ to }: { to: string }) {
  useEffect(() => {
    const canonicalPath = to.endsWith("/") ? to : `${to}/`;
    if (window.location.pathname === canonicalPath) return;

    const nextUrl = `${canonicalPath}${window.location.search}${window.location.hash}`;
    window.history.replaceState(window.history.state, "", nextUrl);
  }, [to]);

  return null;
}
