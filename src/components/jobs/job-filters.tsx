import React from "react";
import { Search, Building2, MapPin, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface JobFiltersProps {
  filterStack: string;
  setFilterStack: (v: string) => void;
  filterCompany: string;
  setFilterCompany: (v: string) => void;
  filterLocation: string;
  setFilterLocation: (v: string) => void;
  filterPlatform: string;
  setFilterPlatform: (v: string) => void;
  onApply: (e: React.FormEvent) => void;
  onClear: () => void;
}

export function JobFilters({
  filterStack,
  setFilterStack,
  filterCompany,
  setFilterCompany,
  filterLocation,
  setFilterLocation,
  filterPlatform,
  setFilterPlatform,
  onApply,
  onClear,
}: JobFiltersProps) {
  return (
    <form
      onSubmit={onApply}
      className="bg-white border border-trampo-border rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.015)] space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-trampo-muted uppercase tracking-wider block">
            Cargo ou Stack
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Ex: React, Node, Frontend"
              value={filterStack}
              onChange={(e) => setFilterStack(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-trampo-muted uppercase tracking-wider block">
            Empresa
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Ex: Google, Stripe"
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-trampo-muted uppercase tracking-wider block">
            Localização
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Ex: Remoto, São Paulo"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-trampo-muted uppercase tracking-wider block">
            Plataforma
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Ex: LinkedIn, Gupy"
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl border border-trampo-border text-trampo-dark hover:bg-neutral-50 font-bold text-xs h-9 cursor-pointer"
          onClick={onClear}
        >
          Limpar Filtros
        </Button>
        <Button
          type="submit"
          className="rounded-xl bg-trampo-primary-500 hover:bg-trampo-primary-400 text-white font-bold text-xs px-5 h-9 shadow-md shadow-trampo-primary-500/10 cursor-pointer"
        >
          Filtrar Resultados
        </Button>
      </div>
    </form>
  );
}
