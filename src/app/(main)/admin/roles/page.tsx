"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  AlertCircle,
  CheckCircle,
  Pencil,
  Plus,
  Power,
  RotateCcw,
  Shield,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoleFormSheet } from "@/components/roles/role-form-sheet";
import { deactivateRole, getRoles, updateRole } from "@/services/role";
import { Role } from "@/types/role";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shortId(id: string): string {
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

type Message = {
  text: string;
  type: "success" | "error";
};

export default function RolesPage() {
  const { status: sessionStatus } = useSession();
  const queryClient = useQueryClient();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [message, setMessage] = useState<Message | null>(null);

  const {
    data: roles,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: getRoles,
    enabled: sessionStatus === "authenticated",
  });

  const roleList: Role[] = roles ?? [];
  const showSkeleton = sessionStatus === "loading" || (isLoading && roleList.length === 0);

  const invalidateRoles = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-roles"] });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => deactivateRole(id),
    onSuccess: () => {
      invalidateRoles();
      setMessage({ text: "Cargo desativado com sucesso!", type: "success" });
    },
    onError: (error: Error) =>
      setMessage({
        text: error.message || "Não foi possível desativar o cargo.",
        type: "error",
      }),
  });

  const reactivateMutation = useMutation({
    mutationFn: (role: Role) =>
      updateRole(role.id, { name: role.name, active: true }),
    onSuccess: () => {
      invalidateRoles();
      setMessage({ text: "Cargo reativado com sucesso!", type: "success" });
    },
    onError: (error: Error) =>
      setMessage({
        text: error.message || "Não foi possível reativar o cargo.",
        type: "error",
      }),
  });

  const openCreate = () => {
    setEditingRole(null);
    setSheetOpen(true);
  };

  const openEdit = (role: Role) => {
    setEditingRole(role);
    setSheetOpen(true);
  };

  return (
    <div className="w-full">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-trampo-dark mb-1">
            Cargos
          </h1>
          <p className="text-xs md:text-sm text-trampo-muted font-semibold">
            Gerencie os cargos (roles) utilizados para controlar as permissões do sistema.
          </p>
        </div>
        <Button
          type="button"
          className="rounded-xl bg-trampo-primary-500 hover:bg-trampo-primary-400 text-white font-bold text-xs h-9 shadow-md shadow-trampo-primary-500/10 cursor-pointer px-4 inline-flex items-center gap-1.5"
          onClick={openCreate}
        >
          <Plus className="w-4 h-4" />
          Novo Cargo
        </Button>
      </header>

      {message && (
        <div
          className={`mb-4 flex items-center gap-3 p-4 rounded-xl border ${
            message.type === "success"
              ? "bg-[#F2FCFA] border-trampo-primary-200 text-trampo-primary-600"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <p className="text-xs font-bold">{message.text}</p>
        </div>
      )}

      {showSkeleton && (
        <div className="w-full rounded-2xl border border-trampo-border bg-white overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1.2fr_1fr] gap-2 items-center px-5 py-3 border-b border-trampo-border bg-neutral-50">
            {["Nome", "Status", "Criado por", "Criado em", "Ações"].map((header) => (
              <span key={header} className="text-[11px] font-extrabold uppercase tracking-wider text-trampo-muted">
                {header}
              </span>
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1.2fr_1fr] gap-2 items-center px-5 py-4 border-b border-trampo-border last:border-b-0 animate-pulse">
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="h-5 bg-neutral-200 rounded w-16" />
              <div className="h-4 bg-neutral-100 rounded w-24" />
              <div className="h-4 bg-neutral-100 rounded w-28" />
              <div className="flex gap-2">
                <div className="h-7 bg-neutral-100 rounded w-7" />
                <div className="h-7 bg-neutral-100 rounded w-7" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!showSkeleton && isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 p-5 flex flex-col items-center justify-center text-center space-y-3">
          <XCircle className="w-10 h-10 text-red-500" />
          <h3 className="font-bold text-sm">Não foi possível carregar os cargos</h3>
          <p className="text-xs text-red-500/80 max-w-md">
            {queryError?.message || "Ocorreu um erro na requisição com o servidor."}
          </p>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border border-red-300 text-red-600 hover:bg-red-100/50 text-xs font-bold"
            onClick={() => refetch()}
          >
            Tentar Novamente
          </Button>
        </div>
      )}

      {!showSkeleton && !isError && roleList.length === 0 && (
        <div className="rounded-2xl border border-trampo-border bg-white p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
          <Shield className="w-12 h-12 text-neutral-300" />
          <div className="space-y-1">
            <h3 className="font-bold text-trampo-dark text-sm">Nenhum cargo encontrado</h3>
            <p className="text-xs text-trampo-muted max-w-sm">
              Os cargos cadastrados aparecerão aqui. Clique em &quot;Novo Cargo&quot; para criar o primeiro.
            </p>
          </div>
          <Button
            type="button"
            className="rounded-xl bg-trampo-primary-500 hover:bg-trampo-primary-400 text-white font-bold text-xs h-9 shadow-md shadow-trampo-primary-500/10 cursor-pointer px-4 inline-flex items-center gap-1.5"
            onClick={openCreate}
          >
            <Plus className="w-4 h-4" />
            Novo Cargo
          </Button>
        </div>
      )}

      {!showSkeleton && !isError && roleList.length > 0 && (
        <div className="w-full rounded-2xl border border-trampo-border bg-white overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1.2fr_1fr] gap-2 items-center px-5 py-3 border-b border-trampo-border bg-neutral-50">
            {["Nome", "Status", "Criado por", "Criado em", "Ações"].map((header) => (
              <span key={header} className="text-[11px] font-extrabold uppercase tracking-wider text-trampo-muted">
                {header}
              </span>
            ))}
          </div>

          {roleList.map((role) => {
            const deactivating = deactivateMutation.isPending && deactivateMutation.variables === role.id;
            const reactivating = reactivateMutation.isPending && reactivateMutation.variables?.id === role.id;

            return (
              <div
                key={role.id}
                className="grid grid-cols-[2fr_1fr_1fr_1.2fr_1fr] gap-2 items-center px-5 py-3.5 border-b border-trampo-border last:border-b-0 hover:bg-neutral-50/50 transition-colors"
              >
                <span className="font-bold text-sm text-trampo-dark truncate" title={role.name}>
                  {role.name}
                </span>

                <span>
                  {role.active ? (
                    <Badge className="rounded-lg bg-[#F2FCFA] text-trampo-primary-600 border border-trampo-primary-100/50 font-bold">
                      Ativo
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="rounded-lg bg-neutral-50 text-neutral-500 font-bold">
                      Inativo
                    </Badge>
                  )}
                </span>

                <span className="text-sm text-trampo-muted truncate font-mono" title={role.createdBy}>
                  {shortId(role.createdBy)}
                </span>

                <span className="text-sm text-trampo-muted">
                  {formatDate(role.createdAt)}
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    className="rounded-lg border border-trampo-border text-trampo-muted hover:text-trampo-dark hover:bg-neutral-50 cursor-pointer"
                    aria-label={`Editar cargo ${role.name}`}
                    onClick={() => openEdit(role)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>

                  {role.active ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      disabled={deactivating}
                      className="rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 cursor-pointer"
                      aria-label={`Desativar cargo ${role.name}`}
                      title="Desativar"
                      onClick={() => deactivateMutation.mutate(role.id)}
                    >
                      {deactivating ? (
                        <span className="w-3.5 h-3.5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                      ) : (
                        <Power className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      disabled={reactivating}
                      className="rounded-lg border border-trampo-primary-200 text-trampo-primary-600 hover:bg-[#F2FCFA] hover:border-trampo-primary-300 cursor-pointer"
                      aria-label={`Reativar cargo ${role.name}`}
                      title="Reativar"
                      onClick={() => reactivateMutation.mutate(role)}
                    >
                      {reactivating ? (
                        <span className="w-3.5 h-3.5 border-2 border-trampo-primary-500/30 border-t-trampo-primary-500 rounded-full animate-spin" />
                      ) : (
                        <RotateCcw className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <RoleFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        role={editingRole}
      />
    </div>
  );
}