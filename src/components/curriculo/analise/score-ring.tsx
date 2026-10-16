"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type ScoreTone = "red" | "amber" | "green";

/** Faixas de cor: 0–39 vermelho, 40–69 âmbar, 70–100 verde. */
export function getScoreTone(score: number): ScoreTone {
  if (score < 40) return "red";
  if (score < 70) return "amber";
  return "green";
}

export function getScoreColor(score: number): string {
  const tone = getScoreTone(score);
  if (tone === "red") return "#EF4444";
  if (tone === "amber") return "#F59E0B";
  return "#2EAF92";
}

/** Rótulos em pt-BR por faixa (4 faixas). */
export function getScoreLabel(score: number): string {
  if (score < 40) return "Insuficiente";
  if (score < 60) return "Regular";
  if (score < 80) return "Bom";
  return "Excelente";
}

export function getScoreToneClasses(score: number): string {
  const tone = getScoreTone(score);
  if (tone === "red") return "bg-red-50 text-red-600 border-red-200";
  if (tone === "amber") return "bg-amber-50 text-amber-600 border-amber-200";
  return "bg-emerald-50 text-emerald-600 border-emerald-200";
}

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  /** Exibe o rótulo em pt-BR abaixo do anel (padrão: sim). */
  showLabel?: boolean;
}

export function ScoreRing({
  score,
  size = 120,
  strokeWidth = 10,
  className,
  showLabel = true,
}: ScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(score) ? score : 0));
  const color = getScoreColor(clamped);
  const label = getScoreLabel(clamped);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference * (1 - clamped / 100);

  // Anima o preenchimento do anel a partir de 0 quando ele entra na tela
  // (o setOffset acontece no callback do frame, fora do corpo síncrono do effect).
  const [offset, setOffset] = useState(circumference);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setOffset(targetOffset));
    return () => cancelAnimationFrame(frame);
  }, [targetOffset, circumference]);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E4E4E7"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 900ms ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-extrabold leading-none tracking-tight text-trampo-dark"
            style={{ fontSize: Math.round(size * 0.28) }}
          >
            {Math.round(clamped)}
          </span>
          <span
            className="font-semibold text-trampo-muted"
            style={{ fontSize: Math.max(9, Math.round(size * 0.09)) }}
          >
            / 100
          </span>
        </div>
      </div>

      {showLabel && (
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider",
            getScoreToneClasses(clamped)
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
