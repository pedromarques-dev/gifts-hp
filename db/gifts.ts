import { env } from "cloudflare:workers";
import type { Gift, GiftPayload } from "../lib/gifts";

type D1GiftRow = {
  id: string;
  house: Gift["house"];
  owner: Gift["owner"];
  name: string;
  description: string;
  imageUrl: string;
  productUrl: string;
  price: number | null;
  priority: number;
  timeframe: Gift["timeframe"];
  status: Gift["status"];
  createdBy: string;
  receivedAt: string | null;
  createdAt: string;
};

function database() {
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database.",
    );
  }

  return env.DB;
}

function rowToGift(row: D1GiftRow): Gift {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    imageUrl: row.imageUrl,
    productUrl: row.productUrl,
    price: row.price ?? undefined,
    priority: row.priority,
    timeframe: row.timeframe,
    status: row.status,
    owner: row.owner,
    house: row.house,
    createdBy: row.createdBy,
    receivedAt: row.receivedAt ?? undefined,
    createdAt: row.createdAt,
  };
}

function readString(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Response(`Campo obrigatório inválido: ${field}`, { status: 400 });
  }

  return value.trim();
}

function readOptionalString(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function readNumber(value: unknown, field: string) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Response(`Campo numérico inválido: ${field}`, { status: 400 });
  }

  return parsed;
}

function readEnum<T extends string>(value: unknown, options: readonly T[], field: string) {
  if (typeof value === "string" && options.includes(value as T)) {
    return value as T;
  }

  throw new Response(`Campo de seleção inválido: ${field}`, { status: 400 });
}

function normalizeInsertPayload(payload: GiftPayload) {
  return {
    id: crypto.randomUUID(),
    name: readString(payload.name, "name"),
    description: readOptionalString(payload.description),
    imageUrl: readString(payload.imageUrl, "imageUrl"),
    productUrl: readOptionalString(payload.productUrl),
    price: payload.price ?? null,
    priority: readNumber(payload.priority, "priority"),
    timeframe: readEnum(payload.timeframe, ["SHORT", "MEDIUM", "LONG"], "timeframe"),
    status: readEnum(payload.status ?? "WANTED", ["WANTED", "RECEIVED"], "status"),
    owner: readEnum(payload.owner, ["ME", "HER"], "owner"),
    house: readEnum(payload.house, ["YASMIN", "PEDRO"], "house"),
    createdBy: readString(payload.createdBy ?? payload.house.toLowerCase(), "createdBy"),
    receivedAt: payload.receivedAt ?? null,
    createdAt: payload.createdAt ?? new Date().toISOString(),
  };
}

function normalizeUpdatePayload(existing: D1GiftRow, payload: Partial<GiftPayload>) {
  return {
    id: existing.id,
    name: payload.name !== undefined ? readString(payload.name, "name") : existing.name,
    description:
      payload.description !== undefined ? readOptionalString(payload.description) : existing.description,
    imageUrl: payload.imageUrl !== undefined ? readString(payload.imageUrl, "imageUrl") : existing.imageUrl,
    productUrl:
      payload.productUrl !== undefined ? readOptionalString(payload.productUrl) : existing.productUrl,
    price: payload.price !== undefined ? payload.price : existing.price,
    priority: payload.priority !== undefined ? readNumber(payload.priority, "priority") : existing.priority,
    timeframe:
      payload.timeframe !== undefined
        ? readEnum(payload.timeframe, ["SHORT", "MEDIUM", "LONG"], "timeframe")
        : existing.timeframe,
    status:
      payload.status !== undefined
        ? readEnum(payload.status, ["WANTED", "RECEIVED"], "status")
        : existing.status,
    owner: payload.owner !== undefined ? readEnum(payload.owner, ["ME", "HER"], "owner") : existing.owner,
    house: payload.house !== undefined ? readEnum(payload.house, ["YASMIN", "PEDRO"], "house") : existing.house,
    createdBy:
      payload.createdBy !== undefined ? readString(payload.createdBy, "createdBy") : existing.createdBy,
    receivedAt:
      payload.receivedAt !== undefined ? readOptionalString(payload.receivedAt) || null : existing.receivedAt,
    createdAt: existing.createdAt,
  };
}

const selectSql = `
  SELECT
    id,
    house,
    owner,
    name,
    description,
    image_url AS imageUrl,
    product_url AS productUrl,
    price,
    priority,
    timeframe,
    status,
    created_by AS createdBy,
    received_at AS receivedAt,
    created_at AS createdAt
  FROM gifts
`;

export async function listGifts() {
  const result = await database()
    .prepare(`${selectSql} ORDER BY created_at DESC, id DESC`)
    .all<D1GiftRow>();

  return (result.results ?? []).map(rowToGift);
}

export async function createGift(payload: GiftPayload) {
  const gift = normalizeInsertPayload(payload);
  await database()
    .prepare(
      `INSERT INTO gifts (
        id, house, owner, name, description, image_url, product_url, price,
        priority, timeframe, status, created_by, received_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      gift.id,
      gift.house,
      gift.owner,
      gift.name,
      gift.description,
      gift.imageUrl,
      gift.productUrl,
      gift.price,
      gift.priority,
      gift.timeframe,
      gift.status,
      gift.createdBy,
      gift.receivedAt,
      gift.createdAt,
    )
    .run();

  return rowToGift({
    id: gift.id,
    house: gift.house,
    owner: gift.owner,
    name: gift.name,
    description: gift.description,
    imageUrl: gift.imageUrl,
    productUrl: gift.productUrl,
    price: gift.price,
    priority: gift.priority,
    timeframe: gift.timeframe,
    status: gift.status,
    createdBy: gift.createdBy,
    receivedAt: gift.receivedAt,
    createdAt: gift.createdAt,
  });
}

export async function updateGift(id: string, payload: Partial<GiftPayload>) {
  const existingResult = await database()
    .prepare(`${selectSql} WHERE id = ? LIMIT 1`)
    .bind(id)
    .all<D1GiftRow>();
  const existing = existingResult.results?.[0];

  if (!existing) {
    throw new Response("Presente não encontrado", { status: 404 });
  }

  const gift = normalizeUpdatePayload(existing, payload);
  await database()
    .prepare(
      `UPDATE gifts SET
        house = ?,
        owner = ?,
        name = ?,
        description = ?,
        image_url = ?,
        product_url = ?,
        price = ?,
        priority = ?,
        timeframe = ?,
        status = ?,
        created_by = ?,
        received_at = ?,
        created_at = ?
      WHERE id = ?`,
    )
    .bind(
      gift.house,
      gift.owner,
      gift.name,
      gift.description,
      gift.imageUrl,
      gift.productUrl,
      gift.price,
      gift.priority,
      gift.timeframe,
      gift.status,
      gift.createdBy,
      gift.receivedAt,
      gift.createdAt,
      id,
    )
    .run();

  return rowToGift(gift);
}

export async function removeGift(id: string) {
  const existingResult = await database()
    .prepare(`${selectSql} WHERE id = ? LIMIT 1`)
    .bind(id)
    .all<D1GiftRow>();
  const existing = existingResult.results?.[0];

  if (!existing) {
    throw new Response("Presente não encontrado", { status: 404 });
  }

  await database().prepare(`DELETE FROM gifts WHERE id = ?`).bind(id).run();
  return rowToGift(existing);
}
