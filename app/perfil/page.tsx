"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BadgeIcon, MapPin, Shield, Edit2, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { getUserProfile, updateUserProfile, GetUserProfileResponse, ApiError } from "@/lib/api";

const profileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  cep: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
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
  const [profile, setProfile] = useState<GetUserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      cpf: "",
      phone: "",
      cep: "",
      street: "",
      number: "",
      complement: "",
      city: "",
      state: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getUserProfile();
        setProfile(data);
        reset({
          name: data.name || "",
          email: data.email || "",
          cpf: data.cpf || "",
          phone: "",
          cep: "",
          street: "",
          number: "",
          complement: "",
          city: "",
          state: "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } catch (error) {
        setMessage({
          type: "error",
          text: error instanceof ApiError ? error.message : "Erro ao carregar perfil."
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setMessage(null);
    try {
      await updateUserProfile({
        name: data.name,
        email: data.email,
        currentPassword: data.currentPassword || undefined,
        newPassword: data.newPassword || undefined,
        confirmNewPassword: data.confirmPassword || undefined,
      });

      setProfile(prev => prev ? { ...prev, name: data.name, email: data.email } : null);

      reset({
        ...data,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof ApiError ? error.message : "Erro ao salvar perfil."
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
            {message && (
              <div
                className={`p-4 rounded-md flex items-center gap-3 ${message.type === "success"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
              >
                {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <p className="font-medium">{message.text}</p>
              </div>
            )}

            {/* Avatar Section */}
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {/* Informações Pessoais */}
              <section>
                <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <BadgeIcon className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold">Informações Pessoais</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" {...register("name")} className="p-6" />
                    {errors.name && <span className="text-red-500 text-sm block mt-1">{errors.name.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" {...register("email")} className="p-6" />
                    {errors.email && <span className="text-red-500 text-sm block mt-1">{errors.email.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" {...register("cpf")} disabled className="p-6 opacity-60" placeholder="000.000.000-00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" {...register("phone")} placeholder="(11) 99999-9999" className="p-6" />
                  </div>
                </div>
              </section>

              {/* Endereço */}
              <section>
                <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold">Endereço</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input id="cep" {...register("cep")} placeholder="00000-000" className="p-6" />
                  </div>
                  <div className="md:col-span-4 space-y-2">
                    <Label htmlFor="street">Rua</Label>
                    <Input id="street" {...register("street")} className="p-6" />
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input id="number" {...register("number")} className="p-6" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input id="complement" {...register("complement")} className="p-6" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" {...register("city")} className="p-6" />
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                          <SelectTrigger id="state" className="p-6">
                            <SelectValue placeholder="UF" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SP">SP</SelectItem>
                            <SelectItem value="RJ">RJ</SelectItem>
                            <SelectItem value="MG">MG</SelectItem>
                            <SelectItem value="RS">RS</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </section>

              {/* Segurança */}
              <section>
                <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold">Segurança</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input id="currentPassword" type="password" {...register("currentPassword")} placeholder="••••••••" className="p-6" autoComplete="off" />
                    {errors.currentPassword && <span className="text-red-500 text-sm block mt-1">{errors.currentPassword.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input id="newPassword" type="password" {...register("newPassword")} placeholder="••••••••" className="p-6" autoComplete="off" />
                    {errors.newPassword && <span className="text-red-500 text-sm block mt-1">{errors.newPassword.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input id="confirmPassword" type="password" {...register("confirmPassword")} placeholder="••••••••" className="p-6" autoComplete="off" />
                    {errors.confirmPassword && <span className="text-red-500 text-sm block mt-1">{errors.confirmPassword.message}</span>}
                  </div>
                </div>
              </section>

              {/* Footer Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <Button type="button" variant="ghost" onClick={() => window.history.back()} className="px-6 py-6 font-semibold">
                  Cancelar
                </Button>
                <Button type="submit" variant="default" disabled={isSubmitting} className="px-8 py-6 font-bold shadow-lg">
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
