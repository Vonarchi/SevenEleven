import type { Metadata } from "next";
import { DiceTable } from "@/components/dice-table/DiceTable";
import { PageShell } from "@/components/ui/PageShell";

export const metadata: Metadata = {
  title: "Solo table",
  description: "Practice classic 7–11 with server-generated dice.",
};

export default function SoloPage() {
  return (
    <PageShell
      title="The private table"
      subtitle="Classic 7–11, no entry fee and no waiting. Every result is generated on the server; your session stats stay on this device."
    >
      <DiceTable roomCode="SOLO-711" endpoint="/api/solo/roll" solo />
    </PageShell>
  );
}
