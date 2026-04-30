"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";

export async function unlockCosmetic(formData: FormData) {
  const supabase = await createClient();
  const service = createServiceClient();

  if (!supabase || !service) {
    redirect("/store?error=Store%20writes%20need%20Supabase%20service%20configuration");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?next=/store");
  }

  const cosmeticId = String(formData.get("cosmeticId") ?? "");
  const { data: cosmetic } = await service
    .from("cosmetics")
    .select("id, price_coins")
    .eq("id", cosmeticId)
    .eq("is_active", true)
    .maybeSingle();

  if (!cosmetic) {
    redirect("/store?error=Cosmetic%20not%20found");
  }

  const { data: wallet } = await service
    .from("wallets")
    .select("coin_balance")
    .eq("user_id", user.id)
    .maybeSingle();

  const balance = Number(wallet?.coin_balance ?? 0);
  if (balance < cosmetic.price_coins) {
    redirect("/store?error=Not%20enough%20coins");
  }

  const { data: owned } = await service
    .from("user_cosmetics")
    .select("id")
    .eq("user_id", user.id)
    .eq("cosmetic_id", cosmetic.id)
    .maybeSingle();

  if (!owned) {
    await service
      .from("wallets")
      .update({
        coin_balance: balance - cosmetic.price_coins,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    await service.from("wallet_transactions").insert({
      user_id: user.id,
      type: "cosmetic_purchase",
      amount: -cosmetic.price_coins,
      source: "store",
      metadata: { cosmetic_id: cosmetic.id },
    });

    await service.from("user_cosmetics").insert({
      user_id: user.id,
      cosmetic_id: cosmetic.id,
    });
  }

  revalidatePath("/store");
}
