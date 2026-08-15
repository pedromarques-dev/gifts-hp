import type { Metadata } from "next";
import { listGifts } from "../db/gifts";
import { MagicalHome } from "./magical-home";

export const metadata: Metadata = {
  title: "The Room of Wishes",
  description:
    "A wizard-level shared wishlist game for Pedro and Yasmin, with magical progress, levels, and original enchanted art.",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const gifts = await listGifts();
  return <MagicalHome initialGifts={gifts} />;
}
