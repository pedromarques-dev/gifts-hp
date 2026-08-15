import type { GiftPayload } from "../../../lib/gifts";
import { createGift, listGifts } from "../../../db/gifts";

export const dynamic = "force-dynamic";

export async function GET() {
  const gifts = await listGifts();
  const response = Response.json({ gifts });
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as GiftPayload;
  const gift = await createGift(payload);
  const response = Response.json({ gift }, { status: 201 });
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}
