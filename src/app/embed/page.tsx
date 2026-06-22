import { CryptoSimulator } from "@/components/CryptoSimulator";

export default function EmbedPage() {
  return (
    <main className="min-h-screen bg-[#fffdf8] p-3 text-[#17211b] sm:p-5">
      <CryptoSimulator compact />
    </main>
  );
}
