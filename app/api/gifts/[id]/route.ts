import { removeGift, updateGift } from "../../../../db/gifts";
import type { GiftPayload } from "../../../../lib/gifts";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = context.params;
  const payload = (await request.json()) as Partial<GiftPayload>;
  const gift = await updateGift(id, payload);
  const response = Response.json({ gift });
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = context.params;
  const gift = await removeGift(id);
  const response = Response.json({ gift });
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}
