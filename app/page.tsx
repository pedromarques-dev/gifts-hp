import type { Metadata } from "next";
import { MagicalHome } from "./magical-home";

export const metadata: Metadata = {
  title: "The Room of Wishes",
  description:
    "A magical shared wishlist for two people who want their gifts to feel like part of the story.",
};

export default function Page() {
  return <MagicalHome />;
}
