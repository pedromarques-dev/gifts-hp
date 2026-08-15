export type HouseId = "YASMIN" | "PEDRO";

export type GiftTimeframe = "SHORT" | "MEDIUM" | "LONG" | "ANY";

export type GiftStatus = "WANTED" | "RECEIVED";

export type GiftOwner = "ME" | "HER";

export type Gift = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  productUrl: string;
  price?: number;
  priority: number;
  timeframe: Exclude<GiftTimeframe, "ANY">;
  status: GiftStatus;
  owner: GiftOwner;
  house: HouseId;
  createdBy: string;
  receivedAt?: string;
  createdAt: string;
};

export type GiftFormState = {
  name: string;
  description: string;
  imageUrl: string;
  productUrl: string;
  price: string;
  priority: string;
  timeframe: Exclude<GiftTimeframe, "ANY">;
  owner: GiftOwner;
  house: HouseId;
};

export type GiftPayload = {
  name: string;
  description: string;
  imageUrl: string;
  productUrl: string;
  price?: number;
  priority: number;
  timeframe: Exclude<GiftTimeframe, "ANY">;
  owner: GiftOwner;
  house: HouseId;
  status?: GiftStatus;
  createdBy?: string;
  receivedAt?: string;
  createdAt?: string;
};
