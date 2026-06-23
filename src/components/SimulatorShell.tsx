import type { ReactNode } from "react";

type SimulatorShellProps = {
  children: ReactNode;
};

export function SimulatorShell({ children }: SimulatorShellProps) {
  return (
    <main className="w-full max-w-full min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="grid gap-6 border-b border-[#d9cfbf] pb-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#936f2b]">
              S'investir - Simulateurs
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-[#17211b] sm:text-5xl">
              Simulateur crypto
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#536057] sm:text-lg">
              Simulez l'évolution potentielle de votre investissement crypto selon votre stratégie
              d'investissement.
            </p>
          </div>
          <div className="rounded-lg border border-[#d9cfbf] bg-[#fffdf8]/80 p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#17211b]">Simulation pédagogique</p>
            <p className="mt-2 text-sm leading-6 text-[#5f665f]">
              Estimez l'évolution potentielle d'une stratégie crypto combinant investissement
              initial, versements mensuels et rendement annualisé.
            </p>
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}
