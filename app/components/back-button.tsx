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
      className="inline-flex items-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-bg)] px-4 py-2 text-sm font-medium text-[var(--accent-fg)] transition-colors hover:border-[var(--accent-hover-border)] hover:bg-[var(--accent-hover-bg)] hover:text-[var(--accent-hover-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-muted)]"
    >
      {label}
    </button>
  );
}
