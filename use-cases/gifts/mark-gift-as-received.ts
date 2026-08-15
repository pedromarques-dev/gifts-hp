import type { GiftRepository } from "../../repositories/gift-repository";

export class MarkGiftAsReceivedUseCase {
  constructor(private giftRepository: GiftRepository) {}

  async execute(giftId: string) {
    const gift = await this.giftRepository.findById(giftId);

    if (!gift) {
      throw new Error("Gift not found");
    }

    gift.markAsReceived();

    await this.giftRepository.update(gift);
  }
}
