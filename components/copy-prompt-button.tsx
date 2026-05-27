"use client";

import { useState } from "react";

type CopyPromptButtonProps = {
  text: string;
};

export function CopyPromptButton({ text }: CopyPromptButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full bg-[linear-gradient(135deg,var(--primary)_0%,var(--accent)_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(93,107,255,0.18)]"
    >
      {copied ? "已复制 Prompt" : "复制 Prompt"}
    </button>
  );
}
