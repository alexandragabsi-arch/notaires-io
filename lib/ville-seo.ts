import { supabase } from "./supabase";

interface VilleSeoFaq {
  q: string;
  r: string;
}

export async function getVilleSeoFaq(ville: string): Promise<VilleSeoFaq[]> {
  const { data } = await supabase
    .from("ville_seo")
    .select("faq_json")
    .eq("ville", ville)
    .maybeSingle();
  if (!data?.faq_json) return [];
  return data.faq_json as VilleSeoFaq[];
}
