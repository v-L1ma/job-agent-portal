import React from "react";
import { Globe } from "lucide-react";

interface PlatformBadgeProps {
  platform: string;
  className?: string;
}

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

export function PlatformBadge({ platform, className }: PlatformBadgeProps) {
  const displayPlatform = platform || "Fonte Externa";
  const normalized = displayPlatform.toLowerCase();

  const baseStyle = "px-2 py-0.5 rounded-lg text-[10px] font-bold inline-flex items-center gap-1.5 border select-none shrink-0";

  if (normalized.includes("linkedin")) {
    return (
      <span className={`${baseStyle} bg-blue-50 text-blue-600 border-blue-100 ${className || ""}`}>
        <LinkedinIcon className="w-3.5 h-3.5" />
        LinkedIn
      </span>
    );
  }
  if (normalized.includes("gupy")) {
    return (
      <span className={`${baseStyle} bg-orange-50 text-orange-600 border-orange-100 ${className || ""}`}>
        <span className="w-3.5 h-3.5 bg-orange-500 text-white rounded-full flex items-center justify-center font-black text-[7px] leading-none">
          G
        </span>
        Gupy
      </span>
    );
  }
  if (normalized.includes("indeed")) {
    return (
      <span className={`${baseStyle} bg-purple-50 text-purple-600 border-purple-100 ${className || ""}`}>
        <span className="w-3.5 h-3.5 bg-purple-600 text-white rounded-full flex items-center justify-center font-black text-[7px] leading-none">
          I
        </span>
        Indeed
      </span>
    );
  }
  if (normalized.includes("vagas")) {
    return (
      <span className={`${baseStyle} bg-emerald-50 text-emerald-600 border-emerald-100 ${className || ""}`}>
        <span className="w-3.5 h-3.5 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-[7px] leading-none">
          V
        </span>
        Vagas.com.br
      </span>
    );
  }

  return (
    <span className={`${baseStyle} bg-neutral-50 text-neutral-600 border-neutral-200 ${className || ""}`}>
      <Globe className="w-3 h-3 text-neutral-400" />
      {displayPlatform}
    </span>
  );
}
