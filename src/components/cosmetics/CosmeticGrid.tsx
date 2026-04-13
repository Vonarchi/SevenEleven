import { CosmeticCard, type CosmeticItem } from "@/components/cosmetics/CosmeticCard";

export function CosmeticGrid({
  items,
  ownedIds,
}: {
  items: CosmeticItem[];
  ownedIds?: Set<string>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <CosmeticCard
          key={item.id}
          item={item}
          owned={ownedIds?.has(item.id)}
        />
      ))}
    </div>
  );
}
