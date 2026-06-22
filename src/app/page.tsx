import { CryptoSimulator } from "@/components/CryptoSimulator";
import { SimulatorShell } from "@/components/SimulatorShell";

export default function HomePage() {
  return (
    <SimulatorShell>
      <CryptoSimulator />
    </SimulatorShell>
  );
}
