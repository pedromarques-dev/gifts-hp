import type { Gift } from "../domain/gift/gift";

export interface GiftRepository {
  findAll(): Promise<Gift[]>;
  findById(id: string): Promise<Gift | null>;
  create(gift: Gift): Promise<void>;
  update(gift: Gift): Promise<void>;
  delete(id: string): Promise<void>;
}
