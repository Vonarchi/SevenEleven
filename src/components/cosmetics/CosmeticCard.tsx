import clsx from "clsx";
import { Button } from "@/components/ui/Button";

export type CosmeticItem = {
  id: string;
  name: string;
  rarity: "common" | "rare" | "legendary";
  priceCoins: number;
};

const rarityStyle: Record<CosmeticItem["rarity"], string> = {
  common: "border-zinc-700/80",
  rare: "border-sky-500/40",
  legendary: "border-amber-400/50",
};

export function CosmeticCard({
  item,
  owned,
}: {
  item: CosmeticItem;
  owned?: boolean;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col rounded-2xl border bg-zinc-900/50 p-4",
        rarityStyle[item.rarity],
      )}
    >
      <div className="mb-4 flex aspect-square items-center justify-center rounded-xl bg-zinc-950/80 text-4xl">
        ✨
      </div>
      <p className="font-medium text-zinc-100">{item.name}</p>
      <p className="text-xs uppercase tracking-wide text-zinc-500">
        {item.rarity}
      </p>
      <p className="mt-2 text-sm text-amber-200/90">
        {item.priceCoins.toLocaleString()} coins
      </p>
      <Button className="mt-4 w-full" disabled={owned}>
        {owned ? "Owned" : "Unlock"}
      </Button>
    </div>
  );
}
