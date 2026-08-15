import type { GiftPayload } from "../../../lib/gifts";
import { createGift, listGifts } from "../../../db/gifts";

export const dynamic = "force-dynamic";

export async function GET() {
  const gifts = await listGifts();
  return Response.json({ gifts });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as GiftPayload;
  const gift = await createGift(payload);
  return Response.json({ gift }, { status: 201 });
}
