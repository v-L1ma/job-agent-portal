import { Card } from "../ui/card";

export function PerfilFormSkeleton() {
  return (
    <div className="mx-auto space-y-12 pb-12 animate-pulse select-none">
      <Card className="p-8">
        <div className="space-y-10">
          {/* Informações Pessoais */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="h-5 w-5 bg-neutral-200 rounded" />
              <div className="h-6 w-48 bg-neutral-200 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-4 w-32 bg-neutral-200 rounded mb-2" />
                <div className="h-14 w-full bg-neutral-100 rounded-lg" />
              </div>
              <div>
                <div className="h-4 w-16 bg-neutral-200 rounded mb-2" />
                <div className="h-14 w-full bg-neutral-100 rounded-lg" />
              </div>
            </div>
          </section>

          {/* Segurança */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="h-5 w-5 bg-neutral-200 rounded" />
              <div className="h-6 w-24 bg-neutral-200 rounded" />
            </div>
            <div className="flex items-center justify-between max-w-sm gap-4">
              <div>
                <div className="h-4 w-28 bg-neutral-200 rounded mb-2" />
                <div className="h-3 w-52 bg-neutral-100 rounded" />
              </div>
              <div className="h-7 w-12 bg-neutral-200 rounded-full" />
            </div>
          </section>

          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="h-12 w-28 bg-neutral-100 rounded-lg" />
            <div className="h-12 w-44 bg-neutral-200 rounded-lg" />
          </div>
        </div>
      </Card>
    </div>
  );
}