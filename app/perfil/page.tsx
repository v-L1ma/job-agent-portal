"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as BadgeIcon, MapPin, Shield, Edit2, Upload, LoaderCircle } from "lucide-react";
import { ApiError, uploadUserCv } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";

function normalizeError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível enviar o currículo.";
}

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useAuth();

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [cvMessage, setCvMessage] = useState<string | null>(null);

  const handleUploadCv = async () => {
    if (!cvFile) {
      setCvMessage("Selecione um arquivo PDF para enviar.");
      return;
    }

    if (cvFile.type !== "application/pdf") {
      setCvMessage("A API aceita apenas arquivos PDF.");
      return;
    }

    try {
      setUploadingCv(true);
      setCvMessage(null);

      const response = await uploadUserCv(cvFile);
      setCvMessage(`Currículo enviado com sucesso. URL: ${response.url}`);
      setCvFile(null);
    } catch (uploadError) {
      if (uploadError instanceof ApiError && uploadError.status === 401) {
        setCvMessage("Sua sessão expirou. Faça login novamente.");
        logout();
        router.replace("/auth/login");
        return;
      }

      setCvMessage(normalizeError(uploadError));
    } finally {
      setUploadingCv(false);
    }
  };

  return (
    <DashboardLayout title="Meu Perfil">
      <div className="max-w-4xl mx-auto space-y-12 pb-12">
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
              <Button variant="default">Alterar foto</Button>
              <Button variant="outline">Remover</Button>
            </div>
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Currículo (PDF)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cv-file">Upload do currículo base</Label>
              <Input
                id="cv-file"
                type="file"
                accept="application/pdf"
                onChange={(event) => setCvFile(event.target.files?.[0] ?? null)}
              />
            </div>

            {cvFile && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Arquivo selecionado: {cvFile.name}
              </p>
            )}

            {cvMessage && (
              <p className="text-xs rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-600 dark:text-slate-300 break-all">
                {cvMessage}
              </p>
            )}

            <Button onClick={() => void handleUploadCv()} disabled={uploadingCv || !cvFile}>
              {uploadingCv ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  Enviando PDF...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Enviar currículo
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <form className="space-y-10">
          {/* Informações Pessoais */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
              <BadgeIcon className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold">Informações Pessoais</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full-name">Nome Completo</Label>
                <Input id="full-name" defaultValue="João Silva" className="p-6" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" defaultValue="joao.silva@exemplo.com" className="p-6" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" placeholder="000.000.000-00" className="p-6" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(11) 99999-9999" className="p-6" />
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
                <Input id="cep" placeholder="00000-000" className="p-6" />
              </div>
              <div className="md:col-span-4 space-y-2">
                <Label htmlFor="street">Rua</Label>
                <Input id="street" className="p-6" />
              </div>
              <div className="md:col-span-1 space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input id="number" className="p-6" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input id="complement" className="p-6" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" className="p-6" />
              </div>
              <div className="md:col-span-1 space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Select>
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
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input id="current-password" type="password" placeholder="••••••••" className="p-6" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input id="new-password" type="password" placeholder="••••••••" className="p-6" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Senha</Label>
                <Input id="confirm-password" type="password" placeholder="••••••••" className="p-6" />
              </div>
            </div>
          </section>

          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <Button variant="ghost" type="button" className="px-6 py-6 font-semibold">
              Cancelar
            </Button>
            <Button variant="default" type="submit" className="px-8 py-6 font-bold shadow-lg">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
