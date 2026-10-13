"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { OnboardingModal } from "@/components/onboarding/onboarding-modal";

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { data: session, update } = useSession();
  const [dismissed, setDismissed] = useState(false);

  const needsOnboarding = session?.user?.onboardingCompleted === false;
  const showModal = needsOnboarding && !dismissed;

  const handleComplete = async () => {
    setDismissed(true);
    await update({ onboardingCompleted: true });
  };

  return (
    <>
      <OnboardingModal isOpen={showModal} onComplete={handleComplete} />
      {children}
    </>
  );
}
