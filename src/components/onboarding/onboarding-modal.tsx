"use client";

import React, { useCallback, useRef, useState } from "react";
import {
  Briefcase,
  FileText,
  ThumbsUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  KeywordsForm,
  KeywordsFormHandle,
} from "../preferencias/keywords-form";
import {
  PrecisionForm,
  PrecisionFormHandle,
} from "../preferencias/precision-form";
import {
  SeniorityForm,
  SeniorityFormHandle,
} from "../preferencias/seniority-form";
import { saveUserPreferences } from "@/services/preference";
import { CurriculoForm } from "../curriculo/curriculo-form";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const steps = [
  {
    icon: Briefcase,
    title: "Bem-vindo ao Job Agent Portal",
    description:
      "Encontre as melhores vagas tech personalizadas para o seu perfil. Nosso sistema automatiza a busca e recomendação de oportunidades.",
    color: "text-trampo-primary-500",
    bg: "bg-trampo-primary-50",
    border: "border-trampo-primary-100",
  },
  {
    icon: ThumbsUp,
    title: "Configure suas palavras-chave",
    description:
      "Adicione termos de busca para encontrar vagas mais relevantes para você.",
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    icon: Sparkles,
    title: "Defina a precisão",
    description:
      "Ajuste o nível de rigor na filtragem das vagas.",
    color: "text-violet-500",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    icon: FileText,
    title: "Selecione suas senioridades",
    description:
      "Escolha os níveis de experiência que se aplicam a você.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: Upload,
    title: "Envie seu currículo",
    description:
      "Faça upload do seu currículo em PDF para personalizar suas candidaturas.",
    color: "text-sky-500",
    bg: "bg-sky-50",
    border: "border-sky-100",
  },
];

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [collectedSkills, setCollectedSkills] = useState<string[]>([]);
  const [collectedPrecision, setCollectedPrecision] = useState<number>(70);
  const [collectedLevels, setCollectedLevels] = useState<string[]>([]);
  const [keywordsValid, setKeywordsValid] = useState(false);
  const [precisionValid, setPrecisionValid] = useState(true);
  const [seniorityValid, setSeniorityValid] = useState(false);

  const keywordsRef = useRef<KeywordsFormHandle>(null);
  const precisionRef = useRef<PrecisionFormHandle>(null);
  const seniorityRef = useRef<SeniorityFormHandle>(null);

  const onKeywordsValidityChange = useCallback((valid: boolean) => setKeywordsValid(valid), []);
  const onPrecisionValidityChange = useCallback((valid: boolean) => setPrecisionValid(valid), []);
  const onSeniorityValidityChange = useCallback((valid: boolean) => setSeniorityValid(valid), []);

  const isStepValid =
    currentStep === 0 || currentStep === 4
      ? true
      : currentStep === 1
        ? keywordsValid
        : currentStep === 2
          ? precisionValid
          : seniorityValid;

  if (!isOpen) return null;

  const step = steps[currentStep];
  const Icon = step.icon;
  const isLast = currentStep === steps.length - 1;
  const isWelcomeStep = currentStep === 0;

  const handleNext = async () => {
    if (isWelcomeStep) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    let skills = collectedSkills;
    let precision = collectedPrecision;
    let levels = collectedLevels;

    if (currentStep === 1) {
      const data = keywordsRef.current?.getData();
      if (data) skills = data.skills;
      setCollectedSkills(skills);
      setCurrentStep((prev) => prev + 1);
      return;
    }

    if (currentStep === 2) {
      const data = precisionRef.current?.getData();
      if (data) precision = data.precision;
      setCollectedPrecision(precision);
      setCurrentStep((prev) => prev + 1);
      return;
    }

    if (currentStep === 3) {
      const data = seniorityRef.current?.getData();
      if (data) levels = data.levels;
      setCollectedLevels(levels);

      try {
        setSaving(true);
        await saveUserPreferences({
          skills: collectedSkills,
          levels,
          precision: collectedPrecision / 100,
        });
      } catch {
        setSaving(false);
        return;
      } finally {
        setSaving(false);
      }

      setCurrentStep((prev) => prev + 1);
    }

    if (currentStep === 4) {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-trampo-dark/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-trampo-border rounded-3xl w-full max-w-xl h-fit max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? "w-6 bg-trampo-primary-500"
                  : i < currentStep
                    ? "w-1.5 bg-trampo-primary-300"
                    : "w-1.5 bg-neutral-200"
              }`}
            />
          ))}
        </div>

        {/* Welcome content */}
        {isWelcomeStep && (
          <>
            <div
              className={`w-14 h-14 ${step.bg} rounded-2xl flex items-center justify-center mx-auto mb-5 border ${step.border}`}
            >
              <Icon className={`w-7 h-7 ${step.color}`} />
            </div>
            <h3 className="text-base font-extrabold text-trampo-dark text-center mb-2">
              {step.title}
            </h3>
            <p className="text-xs text-trampo-muted text-center leading-relaxed font-semibold mb-8">
              {step.description}
            </p>
          </>
        )}

        {/* Form content */}
        {!isWelcomeStep && (
          <div className=" overflow-y-auto mb-4 pr-1">
            {currentStep === 1 && (
              <KeywordsForm ref={keywordsRef} initialData={collectedSkills} onValidityChange={onKeywordsValidityChange} />
            )}
            {currentStep === 2 && (
              <PrecisionForm ref={precisionRef} initialData={collectedPrecision} onValidityChange={onPrecisionValidityChange} />
            )}
            {currentStep === 3 && (
              <SeniorityForm ref={seniorityRef} initialData={collectedLevels} onValidityChange={onSeniorityValidityChange} />
            )}
            {currentStep === 4 && (
              <CurriculoForm mode="modal" />
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            className="flex-1 rounded-xl bg-trampo-primary-500 hover:bg-trampo-primary-600 text-white font-bold text-xs h-9 cursor-pointer shadow-md shadow-trampo-primary-500/10 flex items-center justify-center gap-1.5"
            onClick={handleNext}
            disabled={saving || !isStepValid}
          >
            {saving ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : isLast ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Finalizar
              </>
            ) : (
              <>
                Próximo
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
