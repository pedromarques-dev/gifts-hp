"use client";

import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";

type GiftTimeframe = "SHORT" | "MEDIUM" | "LONG";
type GiftStatus = "WANTED" | "RECEIVED";
type GiftOwner = "ME" | "HER" | "BOTH";

type Gift = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  productUrl: string;
  price?: number;
  priority: number;
  timeframe: GiftTimeframe;
  status: GiftStatus;
  owner: GiftOwner;
  createdBy: string;
  receivedAt?: string;
  createdAt: string;
};

type GiftFormState = {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  productUrl: string;
  price: string;
  priority: string;
  timeframe: GiftTimeframe;
  owner: GiftOwner;
};

const timeframeLabels: Record<GiftTimeframe, string> = {
  SHORT: "Coruja expressa",
  MEDIUM: "Próximo semestre em Hogwarts",
  LONG: "Profecias",
};

const ownerLabels: Record<GiftOwner, string> = {
  ME: "Eu",
  HER: "Ela",
  BOTH: "Nós dois",
};

const ownerFilters: Array<{ label: string; value: GiftOwner | "ALL" }> = [
  { label: "Todos", value: "ALL" },
  { label: "Eu", value: "ME" },
  { label: "Ela", value: "HER" },
  { label: "Nós dois", value: "BOTH" },
];

const timeframeFilters: Array<{ label: string; value: GiftTimeframe | "ALL" }> =
  [
    { label: "Todos", value: "ALL" },
    { label: "Curto", value: "SHORT" },
    { label: "Médio", value: "MEDIUM" },
    { label: "Longo", value: "LONG" },
  ];

const initialGifts: Gift[] = [
  {
    id: "1",
    name: "Lego Castelo de Hogwarts",
    description:
      "Aquele projeto de mesa que vira noite de montagem, chá quente e carinho.",
    imageUrl:
      "https://images.unsplash.com/photo-1516980907201-943c13a8d03b?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    price: 799,
    priority: 5,
    timeframe: "MEDIUM",
    status: "WANTED",
    owner: "BOTH",
    createdBy: "me",
    createdAt: "2026-08-12",
  },
  {
    id: "2",
    name: "Caneca de poção para noites longas",
    description: "Para café, chá e qualquer bebida que diga: fica mais um pouco.",
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    price: 128,
    priority: 3,
    timeframe: "SHORT",
    status: "WANTED",
    owner: "HER",
    createdBy: "her",
    createdAt: "2026-08-11",
  },
  {
    id: "3",
    name: "Nintendo Switch",
    description: "A sala dos desejos já tem espaço reservado para as vitórias.",
    imageUrl:
      "https://images.unsplash.com/photo-1587202372775-98927b09b6d8?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    price: 2199,
    priority: 5,
    timeframe: "LONG",
    status: "RECEIVED",
    owner: "BOTH",
    createdBy: "me",
    receivedAt: "2026-08-09",
    createdAt: "2026-08-01",
  },
  {
    id: "4",
    name: "Bolsa de viagem encantada",
    description: "Cabe tudo que importa para um fim de semana longe da rotina.",
    imageUrl:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    price: 349,
    priority: 4,
    timeframe: "SHORT",
    status: "WANTED",
    owner: "ME",
    createdBy: "her",
    createdAt: "2026-08-08",
  },
  {
    id: "5",
    name: "Álbum de memórias do casal",
    description: "Para guardar ingressos, bilhetes e pequenos feitiços do dia a dia.",
    imageUrl:
      "https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    price: 159,
    priority: 2,
    timeframe: "MEDIUM",
    status: "RECEIVED",
    owner: "BOTH",
    createdBy: "her",
    receivedAt: "2026-08-06",
    createdAt: "2026-07-28",
  },
];

function currency(value?: number) {
  if (typeof value !== "number") return "Preço sob feitiço";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export function MagicalHome() {
  const [gifts, setGifts] = useState(initialGifts);
  const [timeframeFilter, setTimeframeFilter] =
    useState<GiftTimeframe | "ALL">("ALL");
  const [ownerFilter, setOwnerFilter] = useState<GiftOwner | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<GiftStatus | "ALL">("ALL");
  const [owlAlert, setOwlAlert] = useState(false);
  const [editingGiftId, setEditingGiftId] = useState<string | null>(null);
  const [formState, setFormState] = useState<GiftFormState>({
    name: "",
    description: "",
    imageUrl:
      "https://images.unsplash.com/photo-1526662092594-e98c1e356d6a?auto=format&fit=crop&w=1200&q=80",
    productUrl: "",
    price: "",
    priority: "3",
    timeframe: "MEDIUM",
    owner: "BOTH",
  });

  const filteredGifts = useMemo(() => {
    return gifts.filter((gift) => {
      const matchesTimeframe =
        timeframeFilter === "ALL" || gift.timeframe === timeframeFilter;
      const matchesOwner = ownerFilter === "ALL" || gift.owner === ownerFilter;
      const matchesStatus = statusFilter === "ALL" || gift.status === statusFilter;
      return matchesTimeframe && matchesOwner && matchesStatus;
    });
  }, [gifts, timeframeFilter, ownerFilter, statusFilter]);

  const wantedGifts = filteredGifts.filter((gift) => gift.status === "WANTED");
  const receivedGifts = gifts.filter((gift) => gift.status === "RECEIVED");

  const stats = [
    {
      label: "Desejos vivos",
      value: gifts.filter((gift) => gift.status === "WANTED").length,
    },
    {
      label: "Desejos realizados",
      value: gifts.filter((gift) => gift.status === "RECEIVED").length,
    },
    {
      label: "Abraços previstos",
      value: `${gifts.filter((gift) => gift.owner === "BOTH").length} em comum`,
    },
  ];

  const greeting =
    new Date().getHours() >= 18
      ? "Boa noite"
      : new Date().getHours() >= 12
        ? "Boa tarde"
        : "Bom dia";

  function resetForm() {
    setEditingGiftId(null);
    setFormState({
      name: "",
      description: "",
      imageUrl:
        "https://images.unsplash.com/photo-1526662092594-e98c1e356d6a?auto=format&fit=crop&w=1200&q=80",
      productUrl: "",
      price: "",
      priority: "3",
      timeframe: "MEDIUM",
      owner: "BOTH",
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextGift: Gift = {
      id: editingGiftId ?? crypto.randomUUID(),
      name: formState.name.trim(),
      description: formState.description.trim(),
      imageUrl: formState.imageUrl.trim(),
      productUrl: formState.productUrl.trim() || "#",
      price: formState.price ? Number(formState.price) : undefined,
      priority: Number(formState.priority),
      timeframe: formState.timeframe,
      status: "WANTED",
      owner: formState.owner,
      createdBy: "me",
      createdAt: new Date().toISOString(),
    };

    setGifts((current) => {
      if (editingGiftId) {
        return current.map((gift) =>
          gift.id === editingGiftId ? { ...gift, ...nextGift } : gift,
        );
      }
      return [nextGift, ...current];
    });

    resetForm();
  }

  function editGift(gift: Gift) {
    setEditingGiftId(gift.id);
    setFormState({
      id: gift.id,
      name: gift.name,
      description: gift.description,
      imageUrl: gift.imageUrl,
      productUrl: gift.productUrl,
      price: gift.price?.toString() ?? "",
      priority: gift.priority.toString(),
      timeframe: gift.timeframe,
      owner: gift.owner,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteGift(id: string) {
    setGifts((current) => current.filter((gift) => gift.id !== id));
  }

  function markAsReceived(id: string) {
    setGifts((current) =>
      current.map((gift) =>
        gift.id === id
          ? {
              ...gift,
              status: "RECEIVED",
              receivedAt: new Date().toISOString(),
            }
          : gift,
      ),
    );
  }

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,214,153,0.22),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(118,92,255,0.16),transparent_28%),linear-gradient(180deg,rgba(12,15,28,0.96),rgba(8,10,18,1))]" />
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(circle_at_center,black_30%,transparent_90%)]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 text-amber-50 sm:px-6 lg:px-8">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-5 py-6 shadow-[0_24px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:px-8 sm:py-8">
          <div className="absolute -right-10 top-6 h-36 w-36 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="absolute left-8 top-0 h-24 w-24 rounded-full bg-violet-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-black/20 px-3 py-1 text-[0.72rem] uppercase tracking-[0.28em] text-amber-200/90">
                  <span className="text-amber-300">✦</span> The Room of Wishes
                </div>

                <div className="space-y-3">
                  <p className="font-[family-name:var(--font-display)] text-sm tracking-[0.3em] text-amber-100/80 uppercase">
                    {greeting}, a sala estava esperando por vocês
                  </p>
                  <h1 className="max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-[0.92] font-semibold tracking-tight text-balance text-amber-50 sm:text-5xl lg:text-7xl">
                    Um cofre mágico para guardar o que vocês ainda querem viver.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-amber-100/78 sm:text-lg">
                    Pequena o bastante para ser íntima. Elegante o bastante para
                    virar ritual. Cada desejo aqui parece uma carta endereçada ao
                    futuro dos dois.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:w-[28rem] lg:grid-cols-1">
                {stats.map((stat) => (
                  <article
                    key={stat.label}
                    className="rounded-3xl border border-white/10 bg-[#11152a]/70 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-amber-100/60">
                      {stat.label}
                    </p>
                    <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-amber-50">
                      {stat.value}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-amber-100/70">
              <span className="rounded-full border border-amber-200/15 bg-black/25 px-3 py-2">
                Alohomora desbloqueado
              </span>
              <span className="rounded-full border border-amber-200/15 bg-black/25 px-3 py-2">
                Mobile-first
              </span>
              <span className="rounded-full border border-amber-200/15 bg-black/25 px-3 py-2">
                Wish vault v1
              </span>
              <button
                type="button"
                onClick={() => setOwlAlert((value) => !value)}
                className="group inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-2 text-amber-50 transition hover:bg-amber-200/18"
              >
                <span className="transition duration-300 group-hover:-translate-y-1">
                  🦉
                </span>
                {owlAlert ? "A coruja já voou." : "Tocar coruja"}
              </button>
            </div>
            {owlAlert ? (
              <p className="rounded-2xl border border-amber-200/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-50">
                Uma pena caiu do teto e trouxe um lembrete: o próximo presente pode
                ser mais simples do que parece, mas ainda assim muito especial.
              </p>
            ) : null}
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-5">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-amber-200/60">
                    Filtros
                  </p>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
                    Escolha o feitiço certo
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {timeframeFilters.map((item) => (
                    <FilterPill
                      key={item.value}
                      active={timeframeFilter === item.value}
                      label={item.label}
                      onClick={() => setTimeframeFilter(item.value)}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {ownerFilters.map((item) => (
                  <FilterPill
                    key={item.value}
                    active={ownerFilter === item.value}
                    label={item.label}
                    onClick={() => setOwnerFilter(item.value)}
                  />
                ))}
                <FilterPill
                  active={statusFilter === "WANTED"}
                  label="Só desejos"
                  onClick={() =>
                    setStatusFilter((current) =>
                      current === "WANTED" ? "ALL" : "WANTED",
                    )
                  }
                />
                <FilterPill
                  active={statusFilter === "RECEIVED"}
                  label="Sala dos desejos realizados"
                  onClick={() =>
                    setStatusFilter((current) =>
                      current === "RECEIVED" ? "ALL" : "RECEIVED",
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-amber-200/60">
                    Lista principal
                  </p>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-amber-50">
                    Desejos em curso
                  </h2>
                </div>
                <p className="text-sm text-amber-100/70">
                  {wantedGifts.length} item{wantedGifts.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {wantedGifts.map((gift) => (
                  <GiftCard
                    key={gift.id}
                    gift={gift}
                    onEdit={editGift}
                    onDelete={deleteGift}
                    onReceive={markAsReceived}
                  />
                ))}
              </div>

              {wantedGifts.length === 0 ? (
                <EmptyState title="Nenhum desejo na vitrine" />
              ) : null}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-amber-200/15 bg-[#171529]/90 p-5 shadow-[0_24px_100px_rgba(0,0,0,0.38)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-amber-200/55">
                    Novo desejo
                  </p>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
                    {editingGiftId ? "Editar desejo" : "Invocar presente"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.24em] text-amber-100/70 transition hover:bg-white/5"
                >
                  Limpar
                </button>
              </div>

              <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                <Field label="Nome">
                  <input
                    required
                    value={formState.name}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    className="input"
                    placeholder="Lego Castelo de Hogwarts"
                  />
                </Field>

                <Field label="Foto">
                  <input
                    required
                    value={formState.imageUrl}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        imageUrl: event.target.value,
                      }))
                    }
                    className="input"
                    placeholder="https://..."
                  />
                </Field>

                <Field label="Link do produto">
                  <input
                    value={formState.productUrl}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        productUrl: event.target.value,
                      }))
                    }
                    className="input"
                    placeholder="https://"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Preço">
                    <input
                      type="number"
                      min="0"
                      value={formState.price}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          price: event.target.value,
                        }))
                      }
                      className="input"
                      placeholder="R$ 0"
                    />
                  </Field>

                  <Field label="Prioridade">
                    <select
                      value={formState.priority}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          priority: event.target.value,
                        }))
                      }
                      className="input"
                    >
                      {["1", "2", "3", "4", "5"].map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Quando?">
                  <div className="grid gap-2">
                    {Object.entries(timeframeLabels).map(([value, label]) => (
                      <label
                        key={value}
                        className={`rounded-2xl border px-4 py-3 text-sm transition ${
                          formState.timeframe === value
                            ? "border-amber-200/40 bg-amber-200/10 text-amber-50"
                            : "border-white/10 bg-white/5 text-amber-100/80 hover:bg-white/8"
                        }`}
                      >
                        <input
                          type="radio"
                          name="timeframe"
                          className="sr-only"
                          checked={formState.timeframe === value}
                          onChange={() =>
                            setFormState((current) => ({
                              ...current,
                              timeframe: value as GiftTimeframe,
                            }))
                          }
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </Field>

                <Field label="Para quem?">
                  <div className="grid gap-2 sm:grid-cols-3">
                    {Object.entries(ownerLabels).map(([value, label]) => (
                      <label
                        key={value}
                        className={`rounded-2xl border px-4 py-3 text-sm transition ${
                          formState.owner === value
                            ? "border-amber-200/40 bg-amber-200/10 text-amber-50"
                            : "border-white/10 bg-white/5 text-amber-100/80 hover:bg-white/8"
                        }`}
                      >
                        <input
                          type="radio"
                          name="owner"
                          className="sr-only"
                          checked={formState.owner === value}
                          onChange={() =>
                            setFormState((current) => ({
                              ...current,
                              owner: value as GiftOwner,
                            }))
                          }
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </Field>

                <Field label="Observação">
                  <textarea
                    value={formState.description}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    className="input min-h-28 resize-y"
                    placeholder="Quero muito esse porque..."
                  />
                </Field>

                <button
                  type="submit"
                  className="w-full rounded-full bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200 px-5 py-4 font-medium text-slate-950 shadow-[0_16px_40px_rgba(249,201,110,0.26)] transition hover:scale-[1.01]"
                >
                  {editingGiftId ? "✦ Salvar alteração" : "✦ Salvar desejo"}
                </button>
              </form>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-amber-200/55">
                    Realizados
                  </p>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
                    Sala dos desejos realizados
                  </h2>
                </div>
                <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-100">
                  memória viva
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {receivedGifts.map((gift) => (
                  <article
                    key={gift.id}
                    className="rounded-3xl border border-white/10 bg-[#100f1a]/80 p-4"
                  >
                    <div className="flex gap-3">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-amber-300/10">
                        <img
                          src={gift.imageUrl}
                          alt={gift.name}
                          className="h-full w-full object-cover opacity-85"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="truncate font-medium text-amber-50">
                              {gift.name}
                            </h3>
                            <p className="text-xs uppercase tracking-[0.24em] text-amber-100/55">
                              Recebido em {formatDate(gift.receivedAt ?? gift.createdAt)}
                            </p>
                          </div>
                          <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-emerald-100">
                            ✦
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-amber-100/74">
                          {gift.description}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

function FilterPill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        active
          ? "border-amber-300/40 bg-amber-200/15 text-amber-50 shadow-[0_0_0_1px_rgba(255,214,153,0.2)]"
          : "border-white/10 bg-white/5 text-amber-100/72 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-amber-100/78">{label}</span>
      {children}
    </label>
  );
}

function GiftCard({
  gift,
  onEdit,
  onDelete,
  onReceive,
}: {
  gift: Gift;
  onEdit: (gift: Gift) => void;
  onDelete: (id: string) => void;
  onReceive: (id: string) => void;
}) {
  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#121325]/90 shadow-[0_16px_50px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-amber-200/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,207,124,0.14),transparent_32%)] opacity-0 transition group-hover:opacity-100" />
      <div className="relative">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={gift.imageUrl}
            alt={gift.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/28 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/12 bg-black/35 px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-amber-50/90">
              {timeframeLabels[gift.timeframe]}
            </span>
            <span className="rounded-full border border-white/12 bg-black/35 px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-amber-50/90">
              {ownerLabels[gift.owner]}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-100/70">
              {gift.status === "RECEIVED" ? "Desejo realizado" : "Desejo em curso"}
            </p>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-3xl leading-tight text-amber-50">
              {gift.name}
            </h3>
          </div>
        </div>

        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-medium text-amber-50">{currency(gift.price)}</p>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-100/70">
              prioridade {gift.priority}
            </span>
          </div>

          <p className="min-h-12 text-sm leading-6 text-amber-100/76">
            {gift.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <ActionButton onClick={() => onEdit(gift)}>Editar</ActionButton>
            <ActionButton onClick={() => onReceive(gift.id)}>
              Marcar como recebido
            </ActionButton>
            <ActionButton onClick={() => onDelete(gift.id)}>Excluir</ActionButton>
          </div>

          <a
            href={gift.productUrl}
            className="inline-flex items-center gap-2 text-sm text-amber-200 transition hover:text-amber-100"
          >
            Ver presente
            <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}

function ActionButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-amber-100/78 transition hover:border-amber-200/25 hover:bg-amber-200/10 hover:text-amber-50"
    >
      {children}
    </button>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-white/12 bg-white/4 px-6 py-12 text-center text-amber-100/70">
      <p className="font-[family-name:var(--font-display)] text-3xl text-amber-50">
        {title}
      </p>
      <p className="mt-3 text-sm leading-6">
        Ajuste os filtros ou invoque um novo desejo na coluna da direita.
      </p>
    </div>
  );
}
