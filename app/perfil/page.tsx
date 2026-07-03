"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BadgeIcon, MapPin, Shield, Edit2, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { getUserProfile, updateUserProfile, changePassword, ApiError } from "@/lib/api";

const profileSchema = z.object({
  name: z.string().min(6, "Nome deve ter no mínimo 6 caracteres").max(50, "Nome deve ter no máximo 50 caracteres"),
  email: z.string().email("E-mail inválido").min(6, "E-mail deve ter no mínimo 6 caracteres").max(50, "E-mail deve ter no máximo 50 caracteres"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z.string().min(6, "Nova senha deve ter no mínimo 6 caracteres").max(50, "Nova senha deve ter no máximo 50 caracteres"),
  confirmNewPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmNewPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const [profile, setProfile] = useState<{ id: string; name: string; email: string; cpf?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "" },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getUserProfile();
        setProfile(data);
        profileForm.reset({ name: data.name || "", email: data.email || "" });
      } catch (error) {
        setProfileMessage({
          type: "error",
          text: error instanceof ApiError ? error.message : "Erro ao carregar perfil."
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [profileForm]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setProfileMessage(null);
    try {
      await updateUserProfile({ name: data.name, email: data.email });
      setProfile(prev => prev ? { ...prev, name: data.name, email: data.email } : null);
      setProfileMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
    } catch (error) {
      setProfileMessage({
        type: "error",
        text: error instanceof ApiError ? error.message : "Erro ao salvar perfil."
      });
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setPasswordMessage(null);
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });
      passwordForm.reset({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      setPasswordMessage({ type: "success", text: "Senha alterada com sucesso!" });
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text: error instanceof ApiError ? error.message : "Erro ao alterar senha."
      });
    }
  };

  return (
    <DashboardLayout title="Meu Perfil">
      <div className="max-w-4xl mx-auto space-y-12 pb-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Carregando perfil...</p>
          </div>
        ) : (
          <>
            {profileMessage && (
              <div
                className={`p-4 rounded-md flex items-center gap-3 ${profileMessage.type === "success"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
              >
                {profileMessage.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <p className="font-medium">{profileMessage.text}</p>
              </div>
            )}

            <section className="flex flex-col items-center sm:flex-row gap-8">
              <div className="relative group">
                <Avatar className="w-32 h-32 ring-4 ring-primary/20 bg-slate-200 dark:bg-slate-800">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <Button
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 h-8 w-8 rounded-full shadow-lg hover:scale-105 transition-transform"
                  variant="ghost"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold">Sua Foto</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  PNG ou JPG de pelo menos 400x400px.
                </p>
                <div className="flex gap-3 justify-center sm:justify-start">
                  <Button variant="default" type="button">Alterar foto</Button>
                  <Button variant="outline" type="button">Remover</Button>
                </div>
              </div>
            </section>

            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-10">
              <section>
                <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <BadgeIcon className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold">Informações Pessoais</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" {...profileForm.register("name")} className="p-6" />
                    {profileForm.formState.errors.name && (
                      <span className="text-red-500 text-sm block mt-1">{profileForm.formState.errors.name.message}</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" {...profileForm.register("email")} className="p-6" />
                    {profileForm.formState.errors.email && (
                      <span className="text-red-500 text-sm block mt-1">{profileForm.formState.errors.email.message}</span>
                    )}
                  </div>
                  {profile?.cpf && (
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input id="cpf" value={profile.cpf} disabled className="p-6 opacity-60" />
                    </div>
                  )}
                </div>
              </section>

              <div className="flex justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <Button type="submit" variant="default" disabled={profileForm.formState.isSubmitting} className="px-8 py-6 font-bold shadow-lg">
                  {profileForm.formState.isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </div>
            </form>

            <section>
              <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">Segurança</h3>
              </div>

              {passwordMessage && (
                <div className={`p-4 rounded-md flex items-center gap-3 mb-6 ${passwordMessage.type === "success"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                  {passwordMessage.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <p className="font-medium">{passwordMessage.text}</p>
                </div>
              )}

              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input id="currentPassword" type="password" {...passwordForm.register("currentPassword")} placeholder="••••••••" className="p-6" autoComplete="off" />
                    {passwordForm.formState.errors.currentPassword && (
                      <span className="text-red-500 text-sm block mt-1">{passwordForm.formState.errors.currentPassword.message}</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input id="newPassword" type="password" {...passwordForm.register("newPassword")} placeholder="••••••••" className="p-6" autoComplete="off" />
                    {passwordForm.formState.errors.newPassword && (
                      <span className="text-red-500 text-sm block mt-1">{passwordForm.formState.errors.newPassword.message}</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirmar Senha</Label>
                    <Input id="confirmNewPassword" type="password" {...passwordForm.register("confirmNewPassword")} placeholder="••••••••" className="p-6" autoComplete="off" />
                    {passwordForm.formState.errors.confirmNewPassword && (
                      <span className="text-red-500 text-sm block mt-1">{passwordForm.formState.errors.confirmNewPassword.message}</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-6">
                  <Button type="submit" variant="default" disabled={passwordForm.formState.isSubmitting} className="px-8 py-6 font-bold shadow-lg">
                    {passwordForm.formState.isSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Alterando...</>
                    ) : (
                      "Alterar Senha"
                    )}
                  </Button>
                </div>
              </form>
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
