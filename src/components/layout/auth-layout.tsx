import React from "react";

interface AuthLayoutProps {
  form: React.ReactNode;
  banner: React.ReactNode;
}

export function AuthLayout({ form, banner }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-trampo-dark antialiased">
      {/* Form Section */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 xl:px-24">
        <div className="mx-auto w-full max-w-md flex flex-col justify-center">
          {form}
        </div>
      </div>

      {/* Visual SaaS Banner Section (Bright, Clean, Ethereal) */}
      <div className="relative hidden w-1/2 overflow-hidden bg-neutral-50 border-l border-neutral-100 lg:flex flex-col justify-center items-center p-12">
        {/* Soft, large-scale turquoise/green radial gradient glows in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#DDF6F0]/80 to-[#F2FCFA]/90 blur-[80px] pointer-events-none z-0" />
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-[#E8FAF6]/60 blur-[60px] pointer-events-none z-0" />

        {/* Floating product mockup slot */}
        <div className="relative w-full max-w-md z-10 flex justify-center items-center">
          {banner}
        </div>
      </div>
    </div>
  );
}
