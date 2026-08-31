"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { OnboardingModal } from "@/components/onboarding/onboarding-modal";

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { data: session, update } = useSession();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (session?.user?.onboardingCompleted === false) {
      setShowModal(true);
    }
  }, [session]);

  const handleComplete = async () => {
    setShowModal(false);
    await update({ onboardingCompleted: true });
  };

  return (
    <>
      <OnboardingModal isOpen={showModal} onComplete={handleComplete} />
      {children}
    </>
  );
}
