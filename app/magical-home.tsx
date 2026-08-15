"use client";

import type { Dispatch, FormEvent, ReactNode, SetStateAction } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type HouseId = "YASMIN" | "PEDRO";
type GiftTimeframe = "SHORT" | "MEDIUM" | "LONG" | "ANY";
type GiftStatus = "WANTED" | "RECEIVED";
type GiftOwner = "ME" | "HER";

type Gift = {
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

type GiftFormState = {
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

type HouseConfig = {
  id: HouseId;
  label: string;
  subtitle: string;
  pronoun: string;
  schoolHouse: string;
  symbol: string;
  icon: string;
  crestUrl: string;
  accent: string;
  glow: string;
  crest: string;
};

const houses: Record<HouseId, HouseConfig> = {
  YASMIN: {
    id: "YASMIN",
    label: "Yasmin",
    subtitle: "Bruxa da Sonserina, com olhar esperto, presença e estratégia.",
    pronoun: "ela",
    schoolHouse: "Sonserina",
    symbol: "🐍",
    icon: "✦",
    crestUrl: "/houses/slytherin.png",
    accent: "from-emerald-400 via-lime-300 to-cyan-200",
    glow: "rgba(90, 190, 120, 0.22)",
    crest: "Y",
  },
  PEDRO: {
    id: "PEDRO",
    label: "Pedro",
    subtitle: "Bruxo da Grifinória, pronto para treino, saída e inventos.",
    pronoun: "ele",
    schoolHouse: "Grifinória",
    symbol: "🦁",
    icon: "⚡",
    crestUrl: "/houses/gryffindor.png",
    accent: "from-amber-300 via-orange-300 to-rose-200",
    glow: "rgba(250, 190, 87, 0.22)",
    crest: "P",
  },
};

const timeframeLabels: Record<Exclude<GiftTimeframe, "ANY">, string> = {
  SHORT: "Curto prazo",
  MEDIUM: "Médio prazo",
  LONG: "Longo prazo",
};

const timeframeShortLabels: Record<Exclude<GiftTimeframe, "ANY">, string> = {
  SHORT: "Coruja expressa",
  MEDIUM: "Semestre em Hogwarts",
  LONG: "Profecias",
};

const ownerLabels: Record<GiftOwner, string> = {
  ME: "Pedro",
  HER: "Yasmin",
};

const houseFilters: Array<{ label: string; value: HouseId | "ALL" }> = [
  { label: "Mural completo", value: "ALL" },
  { label: "Yasmin / Sonserina", value: "YASMIN" },
  { label: "Pedro / Grifinória", value: "PEDRO" },
];

const houseBadgeCrests: Record<string, string> = {
  GRYFFINDOR: "/houses/gryffindor.png",
  RAVENCLAW: "/houses/ravenclaw.png",
  SLYTHERIN: "/houses/slytherin.png",
  HUFFLEPUFF: "/houses/hufflepuff.png",
};

const initialGifts: Gift[] = [];

const levels = [
  "Aprendiz do Armário",
  "Iniciado das Estrelas",
  "Bruxo de Coruja",
  "Feiticeiro de Bolso",
  "Mago do Castelo",
  "Guardião do Cofre",
  "Arquimago do Amor",
  "Lenda da Torre",
];

function currency(value?: number) {
  if (typeof value !== "number") return "Preço livre";
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
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00`));
}

function xpForGift(gift: Gift) {
  const timeframeScore = {
    SHORT: 18,
    MEDIUM: 28,
    LONG: 40,
  }[gift.timeframe];
  const receivedBonus = gift.status === "RECEIVED" ? 55 : 0;
  return timeframeScore + receivedBonus + gift.priority * 4;
}

function levelFromXp(xp: number) {
  const level = Math.min(levels.length, 1 + Math.floor(xp / 120));
  const prevThreshold = (level - 1) * 120;
  const nextThreshold = level * 120;
  return {
    level,
    title: levels[level - 1],
    progress: ((xp - prevThreshold) / (nextThreshold - prevThreshold)) * 100,
    nextThreshold,
  };
}

function useWizardSoundtrack(enabled: boolean) {
  const audioRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const stepRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const AudioContextClass =
      window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    const audio = audioRef.current ?? new AudioContextClass();
    audioRef.current = audio;
    audio.resume().catch(() => {
      // Autoplay can fail until the browser considers the gesture trusted.
    });

    const notes = [523.25, 659.25, 783.99, 987.77, 880, 659.25];

    const playChord = () => {
      const now = audio.currentTime;
      const root = notes[stepRef.current % notes.length];
      const chord = [root, root * 1.25, root * 1.5];

      chord.forEach((frequency, index) => {
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        osc.type = index === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(frequency, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.02, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
        osc.connect(gain).connect(audio.destination);
        osc.start(now);
        osc.stop(now + 1.7);
      });

      stepRef.current += 1;
    };

    playChord();
    intervalRef.current = window.setInterval(playChord, 1900);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled]);
}

export function MagicalHome() {
  const [gifts, setGifts] = useState(initialGifts);
  const [view, setView] = useState<HouseId | "ALL">("ALL");
  const [timeframeFilter, setTimeframeFilter] = useState<GiftTimeframe | "ANY">("ANY");
  const [statusFilter, setStatusFilter] = useState<GiftStatus | "ANY">("ANY");
  const [editingGiftId, setEditingGiftId] = useState<string | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<HouseId>("YASMIN");
  const [soundOn, setSoundOn] = useState(false);
  const [owlAlert, setOwlAlert] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("Bem-vindo");
  const [formState, setFormState] = useState<GiftFormState>({
    name: "",
    description: "",
    imageUrl:
      "https://images.unsplash.com/photo-1526662092594-e98c1e356d6a?auto=format&fit=crop&w=1200&q=80",
    productUrl: "",
    price: "",
    priority: "3",
    timeframe: "MEDIUM",
    owner: "HER",
    house: "YASMIN",
  });

  useWizardSoundtrack(soundOn);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const currentHour = new Date().getHours();
    setGreeting(
      currentHour >= 18 ? "Boa noite" : currentHour >= 12 ? "Boa tarde" : "Bom dia",
    );
  }, []);

  const filteredGifts = useMemo(() => {
    return gifts.filter((gift) => {
      const matchesHouse = view === "ALL" || gift.house === view;
      const matchesTimeframe =
        timeframeFilter === "ANY" || gift.timeframe === timeframeFilter;
      const matchesStatus = statusFilter === "ANY" || gift.status === statusFilter;
      return matchesHouse && matchesTimeframe && matchesStatus;
    });
  }, [gifts, timeframeFilter, statusFilter, view]);

  const totalWanted = gifts.filter((gift) => gift.status === "WANTED").length;
  const totalReceived = gifts.filter((gift) => gift.status === "RECEIVED").length;
  const combinedXp = gifts.reduce((sum, gift) => sum + xpForGift(gift), 0);
  const overallLevel = levelFromXp(combinedXp);
  const receivedRate = Math.round((totalReceived / Math.max(gifts.length, 1)) * 100);

  const houseStats = (house: HouseId) => {
    const items = gifts.filter((gift) => gift.house === house);
    const wanted = items.filter((gift) => gift.status === "WANTED").length;
    const received = items.filter((gift) => gift.status === "RECEIVED").length;
    const xp = items.reduce((sum, gift) => sum + xpForGift(gift), 0);
    const level = levelFromXp(xp);

    return {
      items,
      wanted,
      received,
      xp,
      level,
      percent: Math.round((received / Math.max(items.length, 1)) * 100),
    };
  };

  const yasminStats = houseStats("YASMIN");
  const pedroStats = houseStats("PEDRO");
  const houseSpotlights = [
    {
      name: "Grifinória",
      crest: houseBadgeCrests.GRYFFINDOR,
      note: "coragem, impulso e faísca",
      tint: "from-red-500/35 via-orange-300/18 to-transparent",
    },
    {
      name: "Corvinal",
      crest: houseBadgeCrests.RAVENCLAW,
      note: "mente afiada e detalhe",
      tint: "from-sky-400/30 via-cyan-300/18 to-transparent",
    },
    {
      name: "Lufa-Lufa",
      crest: houseBadgeCrests.HUFFLEPUFF,
      note: "cuidado, constância e aconchego",
      tint: "from-yellow-300/28 via-amber-200/16 to-transparent",
    },
    {
      name: "Sonserina",
      crest: houseBadgeCrests.SLYTHERIN,
      note: "astúcia, foco e presença",
      tint: "from-emerald-400/32 via-green-300/18 to-transparent",
    },
  ];

  const receivedGifts = gifts.filter((gift) => gift.status === "RECEIVED");
  const activeGifts = filteredGifts.filter((gift) => gift.status === "WANTED");

  function resetForm(nextHouse: HouseId = selectedHouse) {
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
      owner: nextHouse === "YASMIN" ? "HER" : "ME",
      house: nextHouse,
    });
  }

  function openComposer(nextHouse: HouseId = selectedHouse) {
    setSelectedHouse(nextHouse);
    resetForm(nextHouse);
    setComposerOpen(true);
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
      house: formState.house,
      createdBy: formState.house.toLowerCase(),
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

    setToast(editingGiftId ? "Desejo alterado com sucesso." : "Novo desejo adicionado ao cofre.");
    setComposerOpen(false);
    resetForm(nextGift.house);
  }

  function editGift(gift: Gift) {
    setEditingGiftId(gift.id);
    setSelectedHouse(gift.house);
    setFormState({
      name: gift.name,
      description: gift.description,
      imageUrl: gift.imageUrl,
      productUrl: gift.productUrl,
      price: gift.price?.toString() ?? "",
      priority: gift.priority.toString(),
      timeframe: gift.timeframe,
      owner: gift.owner,
      house: gift.house,
    });
    setComposerOpen(true);
  }

  function deleteGift(id: string) {
    setGifts((current) => current.filter((gift) => gift.id !== id));
    setToast("Desejo removido do mapa.");
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
    setToast("✦ Desejo realizado ✦");
    if (navigator.vibrate) navigator.vibrate(40);
  }

  const mapLine = `${totalReceived} comprados · ${totalWanted} em aberto · ${receivedRate}% concluído`;

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,214,153,0.22),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(118,92,255,0.16),transparent_28%),linear-gradient(180deg,rgba(12,15,28,0.96),rgba(8,10,18,1))]" />
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(circle_at_center,black_30%,transparent_90%)]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-7 px-4 py-5 text-amber-50 sm:px-6 lg:px-8">
        <header className="castle-panel overflow-hidden px-5 py-6 sm:px-8 sm:py-8">
          <div className="absolute -right-10 top-6 h-36 w-36 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="absolute left-8 top-0 h-24 w-24 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute inset-0 castle-etch opacity-35" />

          <div className="relative grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 castle-chip px-3 py-1 text-[0.72rem] uppercase tracking-[0.28em] text-amber-200/90">
                <span className="text-amber-300">✦</span> The Room of Wishes
              </div>

              <div className="space-y-4">
                <p className="font-[family-name:var(--font-display)] text-sm tracking-[0.3em] text-amber-100/80 uppercase">
                  {greeting}, o castelo está organizando as casas
                </p>
                <h1 className="max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-[0.9] font-semibold tracking-tight text-balance text-amber-50 sm:text-5xl lg:text-7xl">
                  Uma sala de presentes com brasões, feitiços e o clima certo de Hogwarts.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-amber-100/78 sm:text-lg">
                  Menos cartão arredondado, mais salão de pedra. Cada desejo vira uma peça do mapa,
                  e cada casa ganha presença com seus ícones, referências e espaço para crescer.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="castle-chip px-3 py-2 text-sm text-amber-50">{mapLine}</span>
                <button
                  type="button"
                  onClick={() => setOwlAlert((value) => !value)}
                  className="group inline-flex items-center gap-2 castle-chip px-3 py-2 text-amber-50 transition hover:bg-amber-200/12"
                >
                  <span className="transition duration-300 group-hover:-translate-y-1">🦉</span>
                  {owlAlert ? "Coruja em voo." : "Tocar coruja"}
                </button>
                <button
                  type="button"
                  onClick={() => setSoundOn((value) => !value)}
                  className="castle-chip px-3 py-2 text-sm text-amber-100/80 transition hover:bg-white/10"
                >
                  {soundOn ? "Som ligado" : "Trilha mágica original"}
                </button>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Grifinória", crest: houseBadgeCrests.GRYFFINDOR, tone: "text-amber-200" },
                  { label: "Sonserina", crest: houseBadgeCrests.SLYTHERIN, tone: "text-emerald-200" },
                  { label: "Corvinal", crest: houseBadgeCrests.RAVENCLAW, tone: "text-sky-200" },
                  { label: "Lufa-Lufa", crest: houseBadgeCrests.HUFFLEPUFF, tone: "text-yellow-100" },
                ].map((house) => (
                  <div key={house.label} className="castle-panel-soft flex items-center gap-3 px-4 py-3">
                    <img src={house.crest} alt="" aria-hidden="true" className="h-10 w-10 object-contain" />
                    <div>
                      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-amber-100/55">Casa</p>
                      <p className="font-[family-name:var(--font-display)] text-xl text-amber-50">
                        {house.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="castle-panel-soft overflow-hidden p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-amber-200/60">
                    Ala dos personagens
                  </p>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
                    Harry, Rony e Hermione
                  </h2>
                </div>
                <span className="castle-chip px-3 py-1 text-[0.72rem] uppercase tracking-[0.22em] text-amber-100/75">
                  Hogwarts
                </span>
              </div>

              <HogwartsMural cards={houseSpotlights} />

              <div className="mt-4 grid grid-cols-3 gap-3">
                <HeroStat label="Nível" value={`Nível ${overallLevel.level}`} />
                <HeroStat label="XP total" value={combinedXp} />
                <HeroStat label="Desejos" value={gifts.length} />
              </div>
            </div>
          </div>

          {owlAlert ? (
            <p className="relative mt-5 castle-panel-soft px-4 py-3 text-sm text-amber-50">
              Uma pena caiu do teto e trouxe um lembrete: o próximo presente pode ser simples,
              mas o cofre continua crescendo bonito.
            </p>
          ) : null}
        </header>

        <section className="castle-panel p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-amber-200/60">
                Filtros do castelo
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
                Uma faixa só para organizar o mapa
              </h2>
            </div>
            <button
              type="button"
              onClick={() => openComposer(view === "ALL" ? selectedHouse : view)}
              className="castle-chip inline-flex items-center gap-2 px-4 py-2 text-sm uppercase tracking-[0.24em] text-amber-50 transition hover:bg-amber-200/10"
            >
              <span>+</span>
              Adicionar presente
            </button>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    key: "ANY",
                    icon: "🗺️",
                    title: "Tudo",
                    subtitle: "mural completo",
                  },
                  {
                    key: "SHORT",
                    icon: "🦉",
                    title: "Curto prazo",
                    subtitle: "coruja expressa",
                  },
                  {
                    key: "MEDIUM",
                    icon: "✨",
                    title: "Médio prazo",
                    subtitle: "semestre em Hogwarts",
                  },
                  {
                    key: "LONG",
                    icon: "🔮",
                    title: "Longo prazo",
                    subtitle: "profecias",
                  },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTimeframeFilter(item.key as GiftTimeframe | "ANY")}
                    className={`castle-panel-soft flex items-center gap-3 px-4 py-4 text-left transition hover:-translate-y-0.5 ${
                      timeframeFilter === item.key
                        ? "ring-1 ring-amber-200/35"
                        : ""
                    }`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-white/5 text-2xl">
                      {item.icon}
                    </span>
                    <div>
                      <p className="font-[family-name:var(--font-display)] text-xl text-amber-50">
                        {item.title}
                      </p>
                      <p className="text-xs uppercase tracking-[0.22em] text-amber-100/55">
                        {item.subtitle}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { key: "ANY", icon: "⚪", label: "Tudo" },
                  { key: "WANTED", icon: "📜", label: "Só desejos" },
                  { key: "RECEIVED", icon: "🎁", label: "Realizados" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setStatusFilter(item.key as GiftStatus | "ANY")}
                    className={`castle-chip flex items-center justify-center gap-2 px-4 py-3 text-sm uppercase tracking-[0.2em] transition ${
                      statusFilter === item.key ? "bg-amber-200/12 text-amber-50" : "text-amber-100/75"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  key: "ALL",
                  label: "Mural completo",
                  sub: "ver todos os presentes",
                  crest: "https://commons.wikimedia.org/wiki/Special:FilePath/Coat%20of%20arms%20of%20Hogwarts.svg",
                },
                  {
                    key: "YASMIN",
                    label: "Yasmin / Sonserina",
                    sub: "vitrine da bruxa",
                    crest: houses.YASMIN.crestUrl,
                  },
                {
                  key: "PEDRO",
                  label: "Pedro / Grifinória",
                  sub: "vitrine do bruxinho",
                  crest: houses.PEDRO.crestUrl,
                },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setView(item.key as HouseId | "ALL")}
                  className={`castle-panel-soft flex items-center gap-4 px-4 py-4 text-left transition hover:-translate-y-0.5 ${
                    view === item.key ? "ring-1 ring-amber-200/35" : ""
                  }`}
                >
                  <img
                    src={item.crest}
                    alt=""
                    aria-hidden="true"
                    className="h-14 w-14 shrink-0 object-contain"
                  />
                  <div className="min-w-0">
                    <p className="text-[0.7rem] uppercase tracking-[0.24em] text-amber-100/55">
                      Casa
                    </p>
                    <h3 className="truncate font-[family-name:var(--font-display)] text-xl text-amber-50">
                      {item.label}
                    </h3>
                    <p className="text-xs uppercase tracking-[0.22em] text-amber-100/55">
                      {item.sub}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6">
            <section className="castle-panel p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-amber-200/55">
                    Lista de presentes
                  </p>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
                    Cada casa com seu espaço
                  </h2>
                </div>
                <span className="castle-chip px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-100">
                  {activeGifts.length} em foco
                </span>
              </div>

              {view === "ALL" ? (
                <div className="mt-5 grid gap-5">
                  <HouseColumn
                    house={houses.YASMIN}
                    stats={yasminStats}
                    gifts={filteredGifts.filter((gift) => gift.house === "YASMIN")}
                    onEdit={editGift}
                    onDelete={deleteGift}
                    onReceive={markAsReceived}
                  />
                  <HouseColumn
                    house={houses.PEDRO}
                    stats={pedroStats}
                    gifts={filteredGifts.filter((gift) => gift.house === "PEDRO")}
                    onEdit={editGift}
                    onDelete={deleteGift}
                    onReceive={markAsReceived}
                  />
                </div>
              ) : (
                <div className="mt-5 grid gap-5">
                  <HouseColumn
                    house={houses[view]}
                    stats={view === "YASMIN" ? yasminStats : pedroStats}
                    gifts={filteredGifts.filter((gift) => gift.house === view)}
                    onEdit={editGift}
                    onDelete={deleteGift}
                    onReceive={markAsReceived}
                  />
                </div>
              )}
            </section>

            <section className="castle-panel p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-amber-200/55">
                    Salão dos desejos realizados
                  </p>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
                    Memórias que já viraram conquista
                  </h2>
                </div>
                <span className="castle-chip px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-100">
                  {receivedGifts.length} itens
                </span>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {receivedGifts.length > 0 ? (
                  receivedGifts.map((gift) => (
                    <article
                      key={gift.id}
                      className="castle-panel-soft overflow-hidden p-0"
                    >
                      <div className="grid gap-0">
                        <div className="relative">
                          <img
                            src={gift.imageUrl}
                            alt={gift.name}
                            className="h-56 w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(8,10,18,0.75))]" />
                          <div className="absolute left-4 top-4 castle-chip px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-amber-50">
                            {houses[gift.house].schoolHouse}
                          </div>
                        </div>
                        <div className="space-y-2 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-[family-name:var(--font-display)] text-2xl text-amber-50">
                                {gift.name}
                              </h3>
                              <p className="text-xs uppercase tracking-[0.22em] text-amber-100/55">
                                recebido em {formatDate(gift.receivedAt ?? gift.createdAt)}
                              </p>
                            </div>
                            <span className="castle-chip px-2 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-emerald-100">
                              ✦
                            </span>
                          </div>
                          <p className="text-sm leading-6 text-amber-100/74">
                            {gift.description}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <EmptyState title="Ainda não houve desejo realizado" />
                )}
              </div>
            </section>

            <section className="castle-panel p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-amber-200/55">
                    Mural de Hogwarts
                  </p>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
                    Casas, símbolos e a turma do castelo
                  </h2>
                </div>
                <span className="castle-chip px-3 py-1 text-xs uppercase tracking-[0.22em] text-amber-100/70">
                  ícones e brasões
                </span>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { title: "Grifinória", crest: houseBadgeCrests.GRYFFINDOR, text: "coragem, impulso e faísca" },
                  { title: "Sonserina", crest: houseBadgeCrests.SLYTHERIN, text: "astúcia, foco e presença" },
                  { title: "Corvinal", crest: houseBadgeCrests.RAVENCLAW, text: "mente afiada e detalhe" },
                  { title: "Lufa-Lufa", crest: houseBadgeCrests.HUFFLEPUFF, text: "cuidado, constância e aconchego" },
                ].map((item) => (
                  <article key={item.title} className="castle-panel-soft p-4">
                    <img src={item.crest} alt="" aria-hidden="true" className="h-28 w-full object-contain" />
                    <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl text-amber-50">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-amber-100/72">{item.text}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="castle-panel p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-amber-200/55">
                    Torre de status
                  </p>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
                    Evolução do bruxo
                  </h2>
                </div>
                <span className="castle-chip px-3 py-1 text-xs uppercase tracking-[0.22em] text-amber-100/70">
                  {overallLevel.title}
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <ProgressSection
                  label="XP geral"
                  value={combinedXp}
                  max={overallLevel.nextThreshold}
                />
                <ProgressSection
                  label="Yasmin"
                  value={yasminStats.xp}
                  max={yasminStats.level.nextThreshold}
                />
                <ProgressSection
                  label="Pedro"
                  value={pedroStats.xp}
                  max={pedroStats.level.nextThreshold}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <MiniStat label="Comprados" value={totalReceived} />
                <MiniStat label="Pendentes" value={totalWanted} />
                <MiniStat label="Nível atual" value={overallLevel.level} />
                <MiniStat label="Concluído" value={`${receivedRate}%`} />
              </div>
            </section>

            <section className="castle-panel p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-amber-200/55">
                Modo construtor
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
                O formulário ficou no modal
              </h2>
              <p className="mt-3 text-sm leading-6 text-amber-100/72">
                Clica em “Adicionar presente” para abrir a ficha e preencher sem apertar a página.
              </p>
              <button
                type="button"
                onClick={() => openComposer(selectedHouse)}
                className="mt-4 castle-chip px-4 py-3 text-sm uppercase tracking-[0.2em] text-amber-50"
              >
                Abrir formulário
              </button>
            </section>
          </aside>
        </section>

        <GiftComposerModal
          open={composerOpen}
          editingGiftId={editingGiftId}
          formState={formState}
          selectedHouse={selectedHouse}
          onClose={() => setComposerOpen(false)}
          onSubmit={handleSubmit}
          setFormState={setFormState}
        />

        {toast ? (
          <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 castle-panel-soft px-4 py-3 text-sm text-amber-50">
            {toast}
          </div>
        ) : null}
      </section>
    </main>
  );
}

function StatPanel({
  label,
  value,
  detail,
}: {
  label: string;
  value: ReactNode;
  detail: string;
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-[#11152a]/70 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <p className="text-xs uppercase tracking-[0.22em] text-amber-100/60">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-amber-50">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-amber-100/65">{detail}</p>
    </article>
  );
}

function ProgressSection({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const percent = Math.max(4, Math.min(100, Math.round((value / Math.max(max, 1)) * 100)));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-amber-100/75">
        <span>{label}</span>
        <span>
          {value}/{max} XP
        </span>
      </div>
      <div className="h-3 bg-white/8">
        <div
          className="h-full bg-gradient-to-r from-amber-300 via-orange-300 to-amber-100 shimmer"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="castle-panel-soft px-4 py-3">
      <p className="text-[0.68rem] uppercase tracking-[0.2em] text-amber-100/55">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
        {value}
      </p>
    </div>
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
      <span className="text-xs uppercase tracking-[0.24em] text-amber-100/60">
        {label}
      </span>
      {children}
    </label>
  );
}

function GiftComposerModal({
  open,
  editingGiftId,
  formState,
  selectedHouse,
  onClose,
  onSubmit,
  setFormState,
}: {
  open: boolean;
  editingGiftId: string | null;
  formState: GiftFormState;
  selectedHouse: HouseId;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  setFormState: Dispatch<SetStateAction<GiftFormState>>;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 px-4 py-4 backdrop-blur-md sm:items-center">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-3xl castle-panel p-5 shadow-[0_30px_140px_rgba(0,0,0,0.62)]">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-amber-200/55">
              Modo construtor
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
              {editingGiftId ? "Editar desejo" : "Invocar presente"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="castle-chip px-3 py-2 text-xs uppercase tracking-[0.24em] text-amber-100/70"
          >
            Fechar
          </button>
        </div>

        <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <div className="md:col-span-2">
            <Field label="Casa">
              <div className="grid grid-cols-2 gap-2">
                {(["YASMIN", "PEDRO"] as const).map((value) => (
                  <label
                    key={value}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition ${
                      formState.house === value
                        ? "castle-chip text-amber-50"
                        : "castle-panel-soft text-amber-100/80 hover:bg-white/8"
                    }`}
                  >
                    <input
                      type="radio"
                      name="house"
                      className="sr-only"
                      checked={formState.house === value}
                      onChange={() =>
                        setFormState((current) => ({
                          ...current,
                          house: value,
                          owner: value === "YASMIN" ? "HER" : "ME",
                        }))
                      }
                    />
                    <span className="text-xl">{value === "YASMIN" ? "🦅" : "🦁"}</span>
                    {houses[value].label}
                  </label>
                ))}
              </div>
            </Field>
          </div>

          <Field label="Nome do desejo">
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
              placeholder="Ex: monitor fino para o MacBook"
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

          <Field label="Imagem do presente">
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

          <div className="grid grid-cols-2 gap-3 md:col-span-2">
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
              {(["SHORT", "MEDIUM", "LONG"] as const).map((value) => (
                <label
                  key={value}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition ${
                    formState.timeframe === value
                      ? "castle-chip text-amber-50"
                      : "castle-panel-soft text-amber-100/80 hover:bg-white/8"
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
                        timeframe: value,
                      }))
                    }
                  />
                  <span>
                    {value === "SHORT" ? "🦉" : value === "MEDIUM" ? "✨" : "🔮"}
                  </span>
                  {timeframeLabels[value]}
                </label>
              ))}
            </div>
          </Field>

          <Field label="Para quem?">
            <div className="grid gap-2 sm:grid-cols-2">
              {(["HER", "ME"] as const).map((value) => (
                <label
                  key={value}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition ${
                    formState.owner === value
                      ? "castle-chip text-amber-50"
                      : "castle-panel-soft text-amber-100/80 hover:bg-white/8"
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
                        owner: value,
                        house: value === "HER" ? "YASMIN" : "PEDRO",
                      }))
                    }
                  />
                  <span>{value === "HER" ? "🦅" : "🦁"}</span>
                  {ownerLabels[value]}
                </label>
              ))}
            </div>
          </Field>

          <div className="md:col-span-2 flex items-center justify-between gap-3">
            <span className="text-xs uppercase tracking-[0.22em] text-amber-100/55">
              {houses[selectedHouse].schoolHouse}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="castle-chip px-4 py-3 text-xs uppercase tracking-[0.24em] text-amber-100/70"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="castle-chip bg-amber-200/15 px-4 py-3 text-xs uppercase tracking-[0.24em] text-amber-50"
              >
                {editingGiftId ? "Salvar alteração" : "Salvar desejo"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function HouseColumn({
  house,
  stats,
  gifts,
  onEdit,
  onDelete,
  onReceive,
}: {
  house: HouseConfig;
  stats: ReturnType<typeof levelFromXp> & {
    items: Gift[];
    wanted: number;
    received: number;
    xp: number;
    percent: number;
  };
  gifts: Gift[];
  onEdit: (gift: Gift) => void;
  onDelete: (id: string) => void;
  onReceive: (id: string) => void;
}) {
  const grouped = {
    SHORT: gifts.filter((gift) => gift.timeframe === "SHORT"),
    MEDIUM: gifts.filter((gift) => gift.timeframe === "MEDIUM"),
    LONG: gifts.filter((gift) => gift.timeframe === "LONG"),
  };

  return (
    <article className="castle-panel overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${house.accent}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 castle-chip px-3 py-1 text-[0.72rem] uppercase tracking-[0.28em] text-amber-100/75">
              <img src={house.crestUrl} alt="" aria-hidden="true" className="h-6 w-6 object-contain" />
              {house.label}
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-4xl leading-none text-amber-50">
                {house.schoolHouse}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-amber-100/70">
                {house.subtitle}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.28em] text-amber-100/55">
              nível da torre
            </p>
            <p className="font-[family-name:var(--font-display)] text-4xl text-amber-50">
              Nível {stats.level.level}
            </p>
            <p className="text-sm text-amber-100/70">{stats.level.title}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <HouseMini label="Pendentes" value={stats.wanted} />
          <HouseMini label="Comprados" value={stats.received} />
          <HouseMini label="Concluído" value={`${stats.percent}%`} />
        </div>

        <div className="mt-4">
          <ProgressSection label={`${house.label} XP`} value={stats.xp} max={stats.nextThreshold} />
        </div>

        <div className="mt-5 space-y-4">
          {(["SHORT", "MEDIUM", "LONG"] as const).map((timeframe) => (
            <section key={timeframe} className="space-y-3">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-amber-200/55">
                    {timeframeShortLabels[timeframe]}
                  </p>
                  <h4 className="font-[family-name:var(--font-display)] text-2xl text-amber-50">
                    {timeframeLabels[timeframe]}
                  </h4>
                </div>
                <p className="text-sm text-amber-100/65">{grouped[timeframe].length} itens</p>
              </div>

              <div className="grid gap-3">
                {grouped[timeframe].length > 0 ? (
                  grouped[timeframe].map((gift) => (
                    <GiftCard
                      key={gift.id}
                      gift={gift}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onReceive={onReceive}
                    />
                  ))
                ) : (
                  <div className="castle-panel-soft px-4 py-6 text-sm text-amber-100/60">
                    Nenhum desejo neste prazo ainda.
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}

function HouseMini({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="castle-panel-soft px-4 py-3">
      <p className="text-[0.68rem] uppercase tracking-[0.2em] text-amber-100/55">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
        {value}
      </p>
    </div>
  );
}

function HeroStat({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="castle-panel-soft px-4 py-3">
      <p className="text-[0.66rem] uppercase tracking-[0.24em] text-amber-100/55">
        {label}
      </p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
        {value}
      </p>
    </div>
  );
}

function HogwartsMural({
  cards,
}: {
  cards: Array<{ name: string; crest: string; note: string; tint: string }>;
}) {
  return (
    <div className="relative mt-4 overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(9,12,24,0.98),rgba(10,12,18,0.98))]">
      <div className="absolute inset-0 opacity-45 castle-etch" />
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(86,66,160,0.2),transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(7,8,14,0.94))]" />

      <div className="relative p-4 sm:p-5 lg:p-6">
        <div className="flex items-center justify-center">
          <span className="castle-chip px-4 py-2 text-[0.72rem] uppercase tracking-[0.3em] text-amber-100/80">
            Sorted today
          </span>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map((card) => (
              <article
                key={card.name}
                className={`castle-panel-soft overflow-hidden border-t-4 bg-[#121325]/88 ${card.tint}`}
              >
                <div className="flex items-start justify-between gap-4 px-4 py-4">
                  <div className="space-y-3">
                    <img src={card.crest} alt="" aria-hidden="true" className="h-16 w-16 object-contain" />
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-amber-100/55">
                        Casa
                      </p>
                      <h3 className="font-[family-name:var(--font-display)] text-3xl text-amber-50">
                        {card.name}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[0.72rem] uppercase tracking-[0.22em] text-amber-100/55">
                    Hogwarts
                  </span>
                </div>
                <div className="px-4 pb-4">
                  <p className="max-w-sm text-sm leading-6 text-amber-100/72">
                    {card.note}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="castle-panel-soft overflow-hidden p-5 lg:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-amber-200/55">
                  Ala dos personagens
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
                  Harry, Rony e Hermione
                </h3>
              </div>
              <span className="castle-chip px-3 py-1 text-[0.72rem] uppercase tracking-[0.22em] text-amber-100/75">
                Hogwarts
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              {[
                {
                  title: "Harry",
                  icon: "⚡",
                  text: "o impulso do trio",
                  tone: "from-amber-300/20 via-orange-300/10 to-transparent",
                },
                {
                  title: "Rony",
                  icon: "♟",
                  text: "o coração e o humor",
                  tone: "from-rose-300/18 via-violet-300/10 to-transparent",
                },
                {
                  title: "Hermione",
                  icon: "📚",
                  text: "a estratégia que costura tudo",
                  tone: "from-sky-300/20 via-cyan-300/10 to-transparent",
                },
              ].map((character) => (
                <article
                  key={character.title}
                  className={`castle-panel-soft overflow-hidden bg-[#121325]/82 p-4 ${character.tone}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-amber-100/55">
                        Bruxo do salão
                      </p>
                      <h4 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
                        {character.title}
                      </h4>
                    </div>
                    <span className="text-2xl">{character.icon}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-amber-100/72">{character.text}</p>
                </article>
              ))}
            </div>

            <div className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-amber-100/70">
              Harry, Rony e Hermione entram como eco de fundo, enquanto Pedro e Yasmin ganham
              a própria casa no cofre.
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <article key={card.name} className="castle-panel-soft flex items-center gap-3 px-4 py-4">
              <img src={card.crest} alt="" aria-hidden="true" className="h-14 w-14 object-contain" />
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-amber-100/55">
                  Casa
                </p>
                <h3 className="font-[family-name:var(--font-display)] text-2xl text-amber-50">
                  {card.name}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
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
    <article className="group overflow-hidden castle-panel-soft transition hover:-translate-y-1">
      <div className="relative">
        <img
          src={gift.imageUrl}
          alt={gift.name}
          className="h-64 w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(8,10,18,0.82))]" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="castle-chip px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-amber-50">
            {houses[gift.house].schoolHouse}
          </span>
          <span className="castle-chip px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-amber-50">
            {gift.priority}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          <span className="castle-chip px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-amber-50/90">
            {timeframeShortLabels[gift.timeframe]}
          </span>
          <span className="castle-chip px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-amber-50/90">
            {gift.owner === "HER" ? "Yasmin" : "Pedro"}
          </span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-amber-100/70">
            {gift.status === "RECEIVED" ? "Desejo realizado" : "Desejo em curso"}
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-3xl leading-tight text-amber-50">
            {gift.name}
          </h3>
        </div>
        <p className="text-sm leading-6 text-amber-100/76">{gift.description}</p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-base font-medium text-amber-50">{currency(gift.price)}</p>
          <span className="castle-chip px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-100/70">
            prioridade {gift.priority}
          </span>
        </div>

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
      className="castle-chip px-3 py-2 text-xs uppercase tracking-[0.18em] text-amber-100/78 transition hover:bg-amber-200/10 hover:text-amber-50"
    >
      {children}
    </button>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="castle-panel-soft px-6 py-12 text-center text-amber-100/70">
      <p className="font-[family-name:var(--font-display)] text-3xl text-amber-50">
        {title}
      </p>
      <p className="mt-3 text-sm leading-6">
        Ajuste os filtros ou invoque um novo desejo na torre de magia.
      </p>
    </div>
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
      className={`castle-chip px-4 py-2 text-sm transition ${
        active
          ? "bg-amber-200/15 text-amber-50 shadow-[0_0_0_1px_rgba(255,214,153,0.2)]"
          : "text-amber-100/72 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}
