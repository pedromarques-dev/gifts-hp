import type { Metadata } from "next";
import { MagicalHome } from "./magical-home";

export const metadata: Metadata = {
  title: "The Room of Wishes",
  description:
    "A wizard-level shared wishlist game for Pedro and Yasmin, with magical progress, levels, and original enchanted art.",
};

export default function Page() {
  return <MagicalHome />;
}
