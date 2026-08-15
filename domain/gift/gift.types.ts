export type GiftTimeframe = "SHORT" | "MEDIUM" | "LONG";
export type GiftStatus = "WANTED" | "RECEIVED";
export type GiftOwner = "ME" | "HER" | "BOTH";

export interface GiftProps {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  productUrl?: string;
  price?: number;
  priority?: number;
  timeframe: GiftTimeframe;
  status: GiftStatus;
  owner: GiftOwner;
  createdBy: string;
  receivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
