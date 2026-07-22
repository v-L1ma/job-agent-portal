"use client";

import React from "react";
import { PreferenciasForm } from "@/components/preferencias/preferencias-form";

export default function PreferenciasPage() {
  return (
    <div className="w-full">
      <PreferenciasForm mode="page" />
    </div>
  );
}
