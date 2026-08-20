"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Loader2, IdCard, Eye, EyeOff } from "lucide-react";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Switch } from "../ui/switch";
import { Card } from "../ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changePassword, getUserProfile, updateUserProfile } from "@/services/profile";
import { PerfilFormSkeleton } from "./perfil-form-skeleton";
import { showError, showSuccess } from "@/lib/toast";

const profileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.email("E-mail inválido").min(1, "E-mail é obrigatório"),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    ctx.addIssue({
      path: ["confirmPassword"],
      code: "custom",
      message: "As senhas não coincidem.",
    });
    ctx.addIssue({
      path: ["newPassword"],
      code: "custom",
      message: "As senhas não coincidem.",
    });
  }
  if (data.newPassword && !data.currentPassword) {
    ctx.addIssue({
      path: ["currentPassword"],
      code: "custom",
      message: "A senha atual é necessária para alterar.",
    });
  }
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isShowingPassword, setIsShowingPassword] = useState(false);
  const [isShowingNewPassword, setIsShowingNewPassword] = useState(false);
  const [isShowingConfirmPassword, setIsShowingConfirmPassword] = useState(false);
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => getUserProfile(),
  })

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, isValid },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      email: profile?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    mode: "all",
  });

  useEffect(() => {
    reset({
      name: profile?.name || "",
      email: profile?.email || "",
    })
  }, [profile, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const payload = {
        name: data.name,
        email: data.email
      };
      return updateUserProfile(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      showSuccess('Perfil atualizado', 'Seu perfil foi atualizado com sucesso.');
    },
    onError: (e) => {
      console.error('Error on updateProfileMutation', e)
      showError('Erro ao atualizar perfil', 'Ocorreu um erro ao tentar atualizar o perfil. Por favor, tente novamente.');
    }
  })

  const changePasswordMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const payload = {
        currentPassword: data.currentPassword!,
        newPassword: data.newPassword!,
        confirmNewPassword: data.confirmPassword!,
      };
      return changePassword(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      showSuccess('Senha alterada com sucesso', 'Sua senha foi alterada com sucesso.');
    },
    onError: (e) => {
      console.error('Error on changePasswordMutation', e)
      showError('Erro ao alterar senha', 'Ocorreu um erro ao tentar alterar a senha. Por favor, tente novamente.');
    }
  })

  const onSubmit = async (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);

    if(data.currentPassword && data.newPassword && data.confirmPassword) {
      changePasswordMutation.mutate(data);
    }
  };

  return (
      <div className=" mx-auto space-y-12 pb-12">
        {isLoading ? (
          <PerfilFormSkeleton />
        ) : (
          <Card className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <section>
                <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <IdCard className="w-5 h-5 text-trampo-primary-500"/>
                  <h3 className="text-lg font-bold">Informações Pessoais</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                      name={"name"}
                      control={control}
                      render={({ field: controllerField, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldContent>
                              <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
                              <Input
                                {...controllerField}
                                aria-invalid={fieldState.invalid}
                                placeholder="Digite seu nome completo"
                                type="text"
                                autoComplete="off"
                                className="p-6"
                              />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </FieldContent>
                        </Field>
                      )}
                    />

                    <Controller
                      name={"email"}
                      control={control}
                      render={({ field: controllerField, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldContent>
                              <FieldLabel htmlFor="email">E-mail</FieldLabel>
                              <Input
                                {...controllerField}
                                aria-invalid={fieldState.invalid}
                                placeholder="Digite seu email"
                                type="email"
                                autoComplete="off"
                                className="p-6"
                              />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </FieldContent>
                        </Field>
                      )}
                    />
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Shield className="w-5 h-5 text-trampo-primary-500"/>
                  <h3 className="text-lg font-bold">Segurança</h3>
                </div>
                <Field orientation="horizontal" className="max-w-sm">
                  <FieldContent>
                    <FieldLabel htmlFor="switch-focus-mode">
                      Alterar Senha
                    </FieldLabel>
                    <FieldDescription>
                      Altere sua senha atual para uma nova senha.
                    </FieldDescription>
                  </FieldContent>
                  <Switch 
                    checked={isEditingPassword}
                    onCheckedChange={(checked) => {
                      setIsEditingPassword(checked);
                      reset({
                        ...profile,
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                      });
                    }}  
                  />
                </Field>
                {isEditingPassword && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <Controller
                          name={"currentPassword"}
                          control={control}
                          render={({ field: controllerField, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldContent>
                                  <FieldLabel htmlFor="currentPassword">Senha Atual</FieldLabel>
                                  <div className="flex items-center gap-2">
                                  <Input
                                    {...controllerField}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="••••••••"
                                    type={isShowingPassword ? "text" : "password"}
                                    autoComplete="off"
                                    className="p-6"
                                    />
                                  <Button 
                                    variant='ghost' 
                                    className="w-fit -ml-14"
                                    onClick={() => setIsShowingPassword(prev => !prev)}
                                    >
                                      {isShowingPassword ? (<EyeOff className="size-4.5"/>) : (<Eye className="size-4.5"/>)}
                                  </Button>
                                </div>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </FieldContent>
                            </Field>
                          )}
                        />

                        <div className="hidden lg:block"></div>
                        
                        <Controller
                          name={"newPassword"}
                          control={control}
                          render={({ field: controllerField, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldContent>
                                  <FieldLabel htmlFor="newPassword">Nova Senha</FieldLabel>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      {...controllerField}
                                      aria-invalid={fieldState.invalid}
                                      placeholder="••••••••"
                                      type={isShowingNewPassword ? "text" : "password"}
                                      autoComplete="off"
                                      className="p-6"
                                    />
                                    <Button 
                                    variant='ghost' 
                                    className="w-fit -ml-14"
                                    onClick={() => setIsShowingNewPassword(prev => !prev)}
                                    >
                                      {isShowingNewPassword ? (<EyeOff className="size-4.5"/>) : (<Eye className="size-4.5"/>)}
                                    </Button>
                                  </div>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </FieldContent>
                            </Field>
                          )}
                        />
                        <Controller
                          name={"confirmPassword"}
                          control={control}
                          render={({ field: controllerField, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldContent>
                                  <FieldLabel htmlFor="confirmPassword">Confirmar Nova Senha</FieldLabel>
                                  <div className="flex items-center gap-2">
                                  <Input
                                    {...controllerField}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="••••••••"
                                    type={isShowingConfirmPassword ? "text" : "password"}
                                    autoComplete="off"
                                    className="p-6"
                                  />
                                  <Button 
                                    variant='ghost' 
                                    className="w-fit -ml-14"
                                    onClick={() => setIsShowingConfirmPassword(prev => !prev)}
                                    >
                                      {isShowingConfirmPassword ? (<EyeOff className="size-4.5"/>) : (<Eye className="size-4.5"/>)}
                                    </Button>
                                  </div>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </FieldContent>
                            </Field>
                          )}
                        />
                  </div>
                )}
              </section>

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <Button 
                  type="submit" 
                  variant="default" 
                  disabled={isSubmitting || !isValid} 
                  className="px-8 py-6 font-bold bg-trampo-primary-500 hover:bg-trampo-primary-600 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
  );
}