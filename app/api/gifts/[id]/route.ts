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
  return Response.json({ gift });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = context.params;
  const gift = await removeGift(id);
  return Response.json({ gift });
}
