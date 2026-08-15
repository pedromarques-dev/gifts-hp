import { Gift } from "../domain/gift/gift";
import type { GiftRepository } from "./gift-repository";

export class InMemoryGiftRepository implements GiftRepository {
  public items: Gift[] = [];

  async findAll(): Promise<Gift[]> {
    return this.items.map((item) => new Gift(item.toPlainObject()));
  }

  async findById(id: string): Promise<Gift | null> {
    const item = this.items.find((gift) => gift.id === id);
    return item ? new Gift(item.toPlainObject()) : null;
  }

  async create(gift: Gift): Promise<void> {
    this.items.push(new Gift(gift.toPlainObject()));
  }

  async update(gift: Gift): Promise<void> {
    const index = this.items.findIndex((item) => item.id === gift.id);
    if (index >= 0) {
      this.items[index] = new Gift(gift.toPlainObject());
    }
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id);
  }
}
