import React from "react";
import {
  ExternalLink,
  Building2,
  MoreVertical,
  ThumbsDown,
  Sparkles,
} from "lucide-react";
import { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import { PlatformBadge } from "./platform-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface JobCardProps {
  job: Job;
  onOpenDetails: (jobId: string) => void;
  onGenerateCv: (jobId: string) => void;
  onNotInterestedTrigger: (jobId: string) => void;
  isGenerating: boolean;
}

function truncateText(value: string, length = 160): string {
  if (!value) return "";
  if (value.length <= length) {
    return value;
  }
  return `${value.slice(0, length).trimEnd()}...`;
}

export function JobCard({
  job,
  onOpenDetails,
  onGenerateCv,
  onNotInterestedTrigger,
  isGenerating,
}: JobCardProps) {
  return (
    <div className="group bg-white border border-trampo-border hover:border-trampo-primary-400 hover:shadow-[0_12px_45px_rgba(46,175,146,0.035)] rounded-2xl p-5 flex flex-col min-h-[230px] transition-all duration-300 relative">
      {/* Dropdown Options */}
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 text-neutral-400 hover:text-trampo-dark flex items-center justify-center rounded-full hover:bg-neutral-50 transition-colors cursor-pointer outline-none border border-transparent hover:border-trampo-border/50">
            <MoreVertical className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border border-trampo-border p-1 w-44 rounded-lg shadow-lg">
            <DropdownMenuItem
              className="text-red-500 font-semibold focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer gap-2 py-1.5 text-xs rounded-md"
              onClick={() => onNotInterestedTrigger(job.id)}
            >
              <ThumbsDown className="w-4 h-4" />
              Não tenho interesse
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Header & Content */}
      <div className="pr-6 space-y-2 flex-1">
        <h3 className="font-bold text-trampo-dark tracking-tight leading-snug group-hover:text-trampo-primary-600 transition-colors pr-2">
          {job.title}
        </h3>
        {job.company && (
          <p className="text-xs text-trampo-muted font-bold inline-flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-neutral-400" />
            {job.company}
          </p>
        )}
        <p className="text-xs text-trampo-muted leading-relaxed line-clamp-3">
          {truncateText(job.description)}
        </p>
      </div>

      {/* Bottom Footer Actions */}
      <div className="mt-5 pt-4 border-t border-neutral-100 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <PlatformBadge platform={job.platform} />
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-bold text-trampo-primary-500 hover:text-trampo-primary-600 inline-flex items-center gap-1 hover:underline"
          >
            Abrir vaga
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl border border-trampo-border text-trampo-dark hover:bg-neutral-50 font-bold text-xs h-9 cursor-pointer"
            onClick={() => onOpenDetails(job.id)}
          >
            Ver Detalhes
          </Button>
          <Button
            className="flex-1 rounded-xl bg-trampo-primary-500 hover:bg-trampo-primary-400 text-white font-bold text-xs h-9 shadow-md shadow-trampo-primary-500/10 cursor-pointer inline-flex items-center justify-center gap-1.5"
            disabled={isGenerating}
            onClick={() => onGenerateCv(job.id)}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Personalizar CV
          </Button>
        </div>
      </div>
    </div>
  );
}
