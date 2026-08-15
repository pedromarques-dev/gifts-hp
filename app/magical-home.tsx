"use client";

import type { FormEvent, ReactNode } from "react";
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
  accent: string;
  glow: string;
  crest: string;
};

const houses: Record<HouseId, HouseConfig> = {
  YASMIN: {
    id: "YASMIN",
    label: "Yasmin",
    subtitle: "Bruxa da Corvinal, com olho fino para detalhe e elegância.",
    pronoun: "ela",
    schoolHouse: "Corvinal",
    symbol: "🦅",
    icon: "✦",
    accent: "from-emerald-300 via-cyan-300 to-sky-200",
    glow: "rgba(87, 234, 208, 0.22)",
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
  { label: "Yasmin / Corvinal", value: "YASMIN" },
  { label: "Pedro / Grifinória", value: "PEDRO" },
];

const initialGifts: Gift[] = [
  {
    id: "yasmin-1",
    house: "YASMIN",
    owner: "HER",
    name: "Pijama cirúrgico azul",
    description: "Pra ficar confortável em plantão, casa ou uma noite de descanso real.",
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    priority: 5,
    timeframe: "SHORT",
    status: "WANTED",
    createdBy: "yasmin",
    createdAt: "2026-08-10",
  },
  {
    id: "yasmin-2",
    house: "YASMIN",
    owner: "HER",
    name: "Macacão veterinário verde ou azul",
    description: "O uniforme perfeito para um dia corrido sem perder estilo.",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    priority: 4,
    timeframe: "SHORT",
    status: "WANTED",
    createdBy: "yasmin",
    createdAt: "2026-08-10",
  },
  {
    id: "yasmin-3",
    house: "YASMIN",
    owner: "HER",
    name: "Capa pra iPad",
    description: "Proteção elegante para o tablet acompanhar a rotina sem drama.",
    imageUrl:
      "https://images.unsplash.com/photo-1533746128373-7d9c0bbf2c0c?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    priority: 3,
    timeframe: "SHORT",
    status: "WANTED",
    createdBy: "yasmin",
    createdAt: "2026-08-10",
  },
  {
    id: "yasmin-4",
    house: "YASMIN",
    owner: "HER",
    name: "Tênis pra sair",
    description: "Puma ou Nike, para andar leve e sair bonita sem esforço.",
    imageUrl:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    priority: 4,
    timeframe: "MEDIUM",
    status: "WANTED",
    createdBy: "yasmin",
    createdAt: "2026-08-10",
  },
  {
    id: "yasmin-5",
    house: "YASMIN",
    owner: "HER",
    name: "Sandália arrumadinha",
    description: "Pra sair com conforto, sem cair no havaianas de sempre.",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    priority: 3,
    timeframe: "MEDIUM",
    status: "WANTED",
    createdBy: "yasmin",
    createdAt: "2026-08-10",
  },
  {
    id: "yasmin-6",
    house: "YASMIN",
    owner: "HER",
    name: "Bolsa média pra sair",
    description: "O tamanho certo para caber tudo sem virar mala de viagem.",
    imageUrl:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    priority: 4,
    timeframe: "MEDIUM",
    status: "WANTED",
    createdBy: "yasmin",
    createdAt: "2026-08-10",
  },
  {
    id: "yasmin-7",
    house: "YASMIN",
    owner: "HER",
    name: "Make de Harry Potter",
    description: "Um kit temático, brilhante e bem feitinho para ocasiões especiais.",
    imageUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    priority: 3,
    timeframe: "LONG",
    status: "WANTED",
    createdBy: "yasmin",
    createdAt: "2026-08-10",
  },
  {
    id: "yasmin-8",
    house: "YASMIN",
    owner: "HER",
    name: "Anel com pedrinhas",
    description: "Pra quando o prazo for o que quiser, mas a vontade for agora.",
    imageUrl:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    priority: 5,
    timeframe: "MEDIUM",
    status: "WANTED",
    createdBy: "yasmin",
    createdAt: "2026-08-10",
  },
  {
    id: "pedro-1",
    house: "PEDRO",
    owner: "ME",
    name: "Regata pra treinar",
    description: "Regata mais larguinha no ombro, para treino sem aperto.",
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    priority: 4,
    timeframe: "SHORT",
    status: "WANTED",
    createdBy: "pedro",
    createdAt: "2026-08-10",
  },
  {
    id: "pedro-2",
    house: "PEDRO",
    owner: "ME",
    name: "Short de linho pra sair",
    description: "G ou 42, com folga, leveza e cara de roupa que abraça o calor.",
    imageUrl:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    priority: 5,
    timeframe: "SHORT",
    status: "WANTED",
    createdBy: "pedro",
    createdAt: "2026-08-10",
  },
  {
    id: "pedro-3",
    house: "PEDRO",
    owner: "ME",
    name: "Cuecas novas",
    description: "Para renovar o básico sem drama. Tamanho G.",
    imageUrl:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    priority: 3,
    timeframe: "SHORT",
    status: "WANTED",
    createdBy: "pedro",
    createdAt: "2026-08-10",
  },
  {
    id: "pedro-4",
    house: "PEDRO",
    owner: "ME",
    name: "Óculos de sol novo",
    description: "Quadrado ou hexagonal, com presença de personagem principal.",
    imageUrl:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    priority: 4,
    timeframe: "MEDIUM",
    status: "WANTED",
    createdBy: "pedro",
    createdAt: "2026-08-10",
  },
  {
    id: "pedro-5",
    house: "PEDRO",
    owner: "ME",
    name: "Camisa social nova",
    description: "Tamanho G, boa de caimento e pronta pra ocasião séria.",
    imageUrl:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    priority: 4,
    timeframe: "MEDIUM",
    status: "WANTED",
    createdBy: "pedro",
    createdAt: "2026-08-10",
  },
  {
    id: "pedro-6",
    house: "PEDRO",
    owner: "ME",
    name: "Calça jeans escura ou preta",
    description: "Tamanho 42, versátil e com cara de peça coringa.",
    imageUrl:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    priority: 5,
    timeframe: "MEDIUM",
    status: "WANTED",
    createdBy: "pedro",
    createdAt: "2026-08-10",
  },
  {
    id: "pedro-7",
    house: "PEDRO",
    owner: "ME",
    name: "Relógio digital",
    description: "Pra dar o toque final de item importante e funcional.",
    imageUrl:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    priority: 4,
    timeframe: "MEDIUM",
    status: "WANTED",
    createdBy: "pedro",
    createdAt: "2026-08-10",
  },
  {
    id: "pedro-8",
    house: "PEDRO",
    owner: "ME",
    name: "Monitor fino para o MacBook",
    description: "Complemento leve, bem fino e perfeito para mesa de trabalho.",
    imageUrl:
      "https://images.unsplash.com/photo-1520544814233-1f6b0c5d0b88?auto=format&fit=crop&w=1200&q=80",
    productUrl: "#",
    priority: 5,
    timeframe: "LONG",
    status: "WANTED",
    createdBy: "pedro",
    createdAt: "2026-08-10",
  },
];

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
  const [toast, setToast] = useState<string | null>(null);
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

  const receivedGifts = gifts.filter((gift) => gift.status === "RECEIVED");
  const activeGifts = filteredGifts.filter((gift) => gift.status === "WANTED");

  const currentHour = new Date().getHours();
  const greeting =
    currentHour >= 18 ? "Boa noite" : currentHour >= 12 ? "Boa tarde" : "Bom dia";

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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                  { label: "Grifinória", icon: "🦁", tone: "text-amber-200" },
                  { label: "Sonserina", icon: "🐍", tone: "text-emerald-200" },
                  { label: "Corvinal", icon: "🦅", tone: "text-sky-200" },
                  { label: "Lufa-Lufa", icon: "🦡", tone: "text-yellow-100" },
                ].map((house) => (
                  <div key={house.label} className="castle-panel-soft flex items-center gap-3 px-4 py-3">
                    <span className={`text-2xl ${house.tone}`}>{house.icon}</span>
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

              <HogwartsMural />

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

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <div className="space-y-6">
            <div className="castle-panel p-4 sm:p-5">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-amber-200/60">
                      Filtros de visão
                    </p>
                    <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
                      Escolha a lente do mapa
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(["ANY", "SHORT", "MEDIUM", "LONG"] as const).map((value) => (
                      <FilterPill
                        key={value}
                        active={timeframeFilter === value}
                        label={
                          value === "ANY"
                            ? "Todos"
                            : timeframeShortLabels[value]
                        }
                        onClick={() => setTimeframeFilter(value)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(["ANY", "WANTED", "RECEIVED"] as const).map((value) => (
                    <FilterPill
                      key={value}
                      active={statusFilter === value}
                      label={
                        value === "ANY"
                          ? "Tudo"
                          : value === "WANTED"
                            ? "Só desejos"
                            : "Realizados"
                      }
                      onClick={() => setStatusFilter(value)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {view === "ALL" ? (
              <div className="grid gap-5 lg:grid-cols-2">
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
              <div className="grid gap-5">
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
                      className="castle-panel-soft p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="glyph-panel flex h-14 w-14 shrink-0 items-center justify-center text-2xl text-amber-50">
                          {gift.house === "YASMIN" ? "🦅" : "🦁"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[0.66rem] uppercase tracking-[0.24em] text-amber-100/55">
                                {houses[gift.house].schoolHouse}
                              </p>
                              <h3 className="truncate font-[family-name:var(--font-display)] text-2xl text-amber-50">
                                {gift.name}
                              </h3>
                            </div>
                            <span className="castle-chip px-2 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-emerald-100">
                              ✦
                            </span>
                          </div>
                          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-amber-100/55">
                            recebido em {formatDate(gift.receivedAt ?? gift.createdAt)}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-amber-100/74">
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
                  {
                    title: "Grifinória",
                    icon: "🦁",
                    text: "coragem, impulso e faísca",
                  },
                  {
                    title: "Sonserina",
                    icon: "🐍",
                    text: "astúcia, foco e presença",
                  },
                  {
                    title: "Corvinal",
                    icon: "🦅",
                    text: "mente afiada e detalhe",
                  },
                  {
                    title: "Lufa-Lufa",
                    icon: "🦡",
                    text: "cuidado, constância e aconchego",
                  },
                ].map((item) => (
                  <article key={item.title} className="castle-panel-soft p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{item.icon}</span>
                      <span className="castle-chip px-2 py-1 text-[0.65rem] uppercase tracking-[0.24em] text-amber-100/70">
                        Hogwarts
                      </span>
                    </div>
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
            <div className="castle-panel p-5">
              <div className="flex items-center justify-between gap-4">
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
                  onClick={() => resetForm(selectedHouse)}
                  className="castle-chip px-3 py-2 text-xs uppercase tracking-[0.24em] text-amber-100/70 transition hover:bg-white/5"
                >
                  Limpar
                </button>
              </div>

              <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                <Field label="Casa">
                  <div className="grid grid-cols-2 gap-2">
                    {(["YASMIN", "PEDRO"] as const).map((value) => (
                      <label
                        key={value}
                        className={`rounded-2xl border px-4 py-3 text-sm transition ${
                          formState.house === value
                            ? "border-amber-200/40 bg-amber-200/10 text-amber-50"
                            : "border-white/10 bg-white/5 text-amber-100/80 hover:bg-white/8"
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
                        {houses[value].label}
                      </label>
                    ))}
                  </div>
                </Field>

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
                    {(["SHORT", "MEDIUM", "LONG"] as const).map((value) => (
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
                              timeframe: value,
                            }))
                          }
                        />
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
                              owner: value,
                              house: value === "HER" ? "YASMIN" : "PEDRO",
                            }))
                          }
                        />
                        {ownerLabels[value]}
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
                  className="w-full castle-panel-soft px-5 py-4 font-medium text-slate-950 transition hover:scale-[1.01]"
                >
                  {editingGiftId ? "✦ Salvar alteração" : "✦ Salvar desejo"}
                </button>
              </form>
            </div>

            <div className="castle-panel p-5">
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
            </div>
          </aside>
        </section>

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
              <span className="text-lg">{house.symbol}</span>
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

function HogwartsMural() {
  const trio = [
    {
      name: "Harry",
      icon: "⚡",
      house: "Grifinória",
      note: "o impulso do trio",
      glow: "from-amber-300/40 to-orange-300/10",
    },
    {
      name: "Rony",
      icon: "♟",
      house: "Grifinória",
      note: "o coração e o humor",
      glow: "from-rose-300/30 to-orange-200/10",
    },
    {
      name: "Hermione",
      icon: "📚",
      house: "Corvinal",
      note: "a estratégia que costura tudo",
      glow: "from-sky-300/30 to-cyan-200/10",
    },
  ] as const;

  return (
    <div className="relative mt-4 overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,30,0.98),rgba(8,10,16,0.98))]">
      <div className="absolute inset-0 opacity-50 castle-etch" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(11,12,18,0.92))]" />
      <div className="relative grid gap-3 p-3 sm:grid-cols-3">
        {trio.map((person) => (
          <article
            key={person.name}
            className="castle-panel-soft min-h-44 overflow-hidden p-4"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${person.glow}`} />
            <div className="relative flex h-full flex-col justify-between gap-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[0.66rem] uppercase tracking-[0.24em] text-amber-100/55">
                    Bruxo do salão
                  </p>
                  <h3 className="font-[family-name:var(--font-display)] text-2xl text-amber-50">
                    {person.name}
                  </h3>
                </div>
                <span className="text-2xl">{person.icon}</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm leading-6 text-amber-100/72">{person.note}</p>
                <span className="inline-flex items-center gap-2 castle-chip px-3 py-1 text-[0.72rem] uppercase tracking-[0.22em] text-amber-100/80">
                  {person.house}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="relative border-t border-white/10 px-4 py-3">
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Grifinória", icon: "🦁", tone: "text-amber-200" },
            { label: "Sonserina", icon: "🐍", tone: "text-emerald-200" },
            { label: "Corvinal", icon: "🦅", tone: "text-sky-200" },
            { label: "Lufa-Lufa", icon: "🦡", tone: "text-yellow-100" },
          ].map((house) => (
            <div
              key={house.label}
              className="castle-chip flex items-center justify-center gap-2 px-3 py-2 text-xs uppercase tracking-[0.22em] text-amber-50"
            >
              <span className={`text-sm ${house.tone}`}>{house.icon}</span>
              <span>{house.label}</span>
            </div>
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
      <div className="grid gap-0 md:grid-cols-[7.5rem_1fr]">
        <div className="relative flex min-h-44 flex-col justify-between border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,214,122,0.12),rgba(255,255,255,0.02))] p-4 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between">
            <span className="text-2xl">{gift.house === "YASMIN" ? "🦅" : "🦁"}</span>
            <span className="text-xs uppercase tracking-[0.22em] text-amber-100/55">
              {gift.priority}
            </span>
          </div>
          <div className="glyph-panel flex flex-1 items-center justify-center text-4xl text-amber-50">
            {gift.timeframe === "SHORT" ? "✦" : gift.timeframe === "MEDIUM" ? "❖" : "✧"}
          </div>
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-amber-100/60">
            slot vazio
          </p>
        </div>

        <div className="flex min-w-0 flex-col justify-between gap-4 p-4">
          <div className="space-y-2">
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
          </div>

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
