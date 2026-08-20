"use client";

import React from "react";
import { CurriculoForm } from "@/components/curriculo/curriculo-form";

export default function CurriculoPage() {
  return (
    <div className="w-full">
      <CurriculoForm mode="page" />
    </div>
  );
}
