"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  fallbackHref: string;
  label?: string;
};

export default function BackButton({
  fallbackHref,
  label = "Indietro",
}: BackButtonProps) {
  const router = useRouter();

  function handleClick() {
    const hasReferrer = typeof document !== "undefined" && document.referrer.length > 0;

    if (hasReferrer && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center bg-[var(--accent-bg)] px-4 py-2 text-xs font-black uppercase tracking-wider text-[var(--accent-fg)] transition-colors hover:bg-[var(--accent-hover-bg)] hover:text-[var(--accent-hover-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sport)]"
    >
      {label}
    </button>
  );
}
