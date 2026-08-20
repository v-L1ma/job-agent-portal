"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { createRole, updateRole } from "@/services/role";
import { Role } from "@/types/role";
import { showError, showSuccess } from "@/lib/toast";

const roleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Este campo é obrigatório")
    .max(50, "O nome deve ter no máximo 50 caracteres"),
  active: z.boolean(),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
}

export function RoleFormSheet({ open, onOpenChange, role }: RoleFormSheetProps) {
  const isEditing = Boolean(role);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: "", active: true },
    mode: "all",
  });

  useEffect(() => {
    if (open) {
      reset(role ? { name: role.name, active: role.active } : { name: "", active: true });
    }
  }, [open, role, reset]);

  const saveRoleMutation = useMutation({
    mutationFn: (data: RoleFormValues) =>
      role ? updateRole(role.id, data) : createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      showSuccess(
        isEditing ? "Cargo atualizado" : "Cargo criado",
        isEditing
          ? "O cargo foi atualizado com sucesso."
          : "O cargo foi criado com sucesso."
      );
      onOpenChange(false);
    },
    onError: (e) => {
      console.error("Error on saveRoleMutation", e);
      showError(
        "Erro ao salvar cargo",
        "Ocorreu um erro ao tentar salvar o cargo. Por favor, tente novamente."
      );
    },
  });

  const onSubmit = (data: RoleFormValues) => {
    saveRoleMutation.mutate(data);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 gap-0">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Editar Cargo" : "Novo Cargo"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Atualize o nome e o status do cargo."
              : "Cadastre um novo cargo para controlar as permissões do sistema."}
          </SheetDescription>
        </SheetHeader>

        <form id="role-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 px-4 pt-2 pb-4 flex-1 overflow-y-auto">
          <Controller
            name="name"
            control={control}
            render={({ field: controllerField, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="role-name">
                    Nome <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...controllerField}
                    id="role-name"
                    aria-invalid={fieldState.invalid}
                    placeholder='Ex: "Recruiter"'
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />

          {isEditing && (
            <Controller
              name="active"
              control={control}
              render={({ field: controllerField }) => (
                <Field orientation="horizontal" className="p-4 rounded-xl border border-trampo-border bg-white">
                  <FieldContent>
                    <FieldLabel htmlFor="role-active">Ativo</FieldLabel>
                    <FieldDescription>
                      Desative para desativar o cargo no sistema.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="role-active"
                    checked={controllerField.value}
                    onCheckedChange={controllerField.onChange}
                  />
                </Field>
              )}
            />
          )}
        </form>

        <div className="border-t border-trampo-border p-4">
          <Button
            type="submit"
            form="role-form"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-trampo-primary-500 hover:bg-trampo-primary-400 text-white font-bold text-xs h-10 shadow-md shadow-trampo-primary-500/10 cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : isEditing ? (
              "Salvar Alterações"
            ) : (
              "Criar Cargo"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}