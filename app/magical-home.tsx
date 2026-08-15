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
  accent: string;
  glow: string;
  crest: string;
};

const houses: Record<HouseId, HouseConfig> = {
  YASMIN: {
    id: "YASMIN",
    label: "Yasmin",
    subtitle: "A torre das vontades delicadas e úteis",
    pronoun: "ela",
    accent: "from-emerald-300 via-cyan-300 to-sky-200",
    glow: "rgba(87, 234, 208, 0.22)",
    crest: "Y",
  },
  PEDRO: {
    id: "PEDRO",
    label: "Pedro",
    subtitle: "A torre dos trajes, treinos e engenhocas",
    pronoun: "ele",
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
  { label: "Yasmin", value: "YASMIN" },
  { label: "Pedro", value: "PEDRO" },
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
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-5 py-6 shadow-[0_24px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:px-8 sm:py-8">
          <div className="absolute -right-10 top-6 h-36 w-36 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="absolute left-8 top-0 h-24 w-24 rounded-full bg-violet-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-black/20 px-3 py-1 text-[0.72rem] uppercase tracking-[0.28em] text-amber-200/90">
                  <span className="text-amber-300">✦</span> The Room of Wishes
                </div>

                <div className="space-y-3">
                  <p className="font-[family-name:var(--font-display)] text-sm tracking-[0.3em] text-amber-100/80 uppercase">
                    {greeting}, o cofre está avaliando a missão do casal
                  </p>
                  <h1 className="max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-[0.92] font-semibold tracking-tight text-balance text-amber-50 sm:text-5xl lg:text-7xl">
                    Dois quartos. Uma aventura. Um status de bruxo que sobe com cada presente.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-amber-100/78 sm:text-lg">
                    A sala se comporta como um jogo leve: cada item comprado dá XP,
                    a torre ganha níveis e a lista vira memória viva dos dois.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:w-[28rem] lg:grid-cols-1">
                <StatPanel label="Nível de bruxo" value={`Nível ${overallLevel.level}`} detail={overallLevel.title} />
                <StatPanel label="XP total" value={combinedXp} detail={`${mapLine}`} />
                <StatPanel label="Feitiço ativo" value={`${gifts.length} desejos`} detail="cada carta vale XP" />
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
              <div className="flex flex-wrap items-center gap-3 text-sm text-amber-100/70">
                <span className="rounded-full border border-amber-200/15 bg-black/25 px-3 py-2">
                  {mapLine}
                </span>
                <button
                  type="button"
                  onClick={() => setOwlAlert((value) => !value)}
                  className="group inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-2 text-amber-50 transition hover:bg-amber-200/18"
                >
                  <span className="transition duration-300 group-hover:-translate-y-1">
                    🦉
                  </span>
                  {owlAlert ? "Coruja em voo." : "Tocar coruja"}
                </button>
                <button
                  type="button"
                  onClick={() => setSoundOn((value) => !value)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-amber-100/80 transition hover:bg-white/10"
                >
                  {soundOn ? "Som ligado" : "Trilha mágica original"}
                </button>
              </div>
              <FilterPill active={timeframeFilter === "ANY"} label="Todos os prazos" onClick={() => setTimeframeFilter("ANY")} />
              <FilterPill active={statusFilter === "ANY"} label="Todos os status" onClick={() => setStatusFilter("ANY")} />
              <div className="flex gap-2">
                {houseFilters.map((item) => (
                  <FilterPill
                    key={item.value}
                    active={view === item.value}
                    label={item.label}
                    onClick={() => setView(item.value)}
                  />
                ))}
              </div>
            </div>

            {owlAlert ? (
              <p className="rounded-2xl border border-amber-200/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-50">
                Uma pena caiu do teto e trouxe um lembrete: o próximo presente pode
                ser simples, mas a história que ele cria ainda fica gigante.
              </p>
            ) : null}
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-5">
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

            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-amber-200/55">
                    Salão dos desejos realizados
                  </p>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
                    Memórias que já viraram conquista
                  </h2>
                </div>
                <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-100">
                  {receivedGifts.length} itens
                </span>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {receivedGifts.length > 0 ? (
                  receivedGifts.map((gift) => (
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
                                {houses[gift.house].label} · recebido em{" "}
                                {formatDate(gift.receivedAt ?? gift.createdAt)}
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
                  ))
                ) : (
                  <EmptyState title="Ainda não houve desejo realizado" />
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-amber-200/55">
                    Galeria mágica
                  </p>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
                    Personagens e relíquias do cofre
                  </h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-amber-100/70">
                  original svg
                </span>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {wizardGallery.map((item) => (
                  <WizardCard key={item.name} item={item} />
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-amber-200/15 bg-[#171529]/90 p-5 shadow-[0_24px_100px_rgba(0,0,0,0.38)] backdrop-blur-xl">
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
                  className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.24em] text-amber-100/70 transition hover:bg-white/5"
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

                <Field label="Foto / ilustração">
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
                  className="w-full rounded-full bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200 px-5 py-4 font-medium text-slate-950 shadow-[0_16px_40px_rgba(249,201,110,0.26)] transition hover:scale-[1.01]"
                >
                  {editingGiftId ? "✦ Salvar alteração" : "✦ Salvar desejo"}
                </button>
              </form>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-amber-200/55">
                    Torre de status
                  </p>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
                    Evolução do bruxo
                  </h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-amber-100/70">
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
          <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-amber-200/20 bg-slate-950/90 px-4 py-3 text-sm text-amber-50 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
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
      <div className="h-3 rounded-full bg-white/8">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-300 via-orange-300 to-amber-100 shimmer"
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
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
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
    <article className="rounded-[2rem] border border-white/10 bg-[#101225]/90 shadow-[0_18px_70px_rgba(0,0,0,0.36)] backdrop-blur-xl">
      <div className={`rounded-[2rem] bg-gradient-to-br ${house.accent} p-[1px]`}>
        <div className="rounded-[calc(2rem-1px)] bg-[#101225]/95 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.72rem] uppercase tracking-[0.28em] text-amber-100/75">
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-amber-50">
                  {house.crest}
                </span>
                {house.label}
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-4xl leading-none text-amber-50">
                {house.label}
              </h3>
              <p className="max-w-md text-sm leading-6 text-amber-100/70">
                {house.subtitle}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.28em] text-amber-100/55">
                nível
              </p>
              <p className="font-[family-name:var(--font-display)] text-4xl text-amber-50">
                {stats.level}
              </p>
              <p className="text-sm text-amber-100/70">{stats.title}</p>
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
                    <div className="rounded-2xl border border-dashed border-white/12 bg-white/4 px-4 py-6 text-sm text-amber-100/60">
                      Nenhum desejo neste prazo ainda.
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
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
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-[0.68rem] uppercase tracking-[0.2em] text-amber-100/55">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
        {value}
      </p>
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
  const frame =
    gift.house === "YASMIN"
      ? "from-emerald-300/30 via-cyan-300/20 to-sky-200/30"
      : "from-amber-300/30 via-orange-300/20 to-rose-200/30";

  return (
    <article className="group relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#121325]/92 shadow-[0_16px_50px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-amber-200/20">
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,207,124,0.12),transparent_30%)] opacity-0 transition group-hover:opacity-100`} />
      <div className="relative">
        <div className="grid gap-3 p-4 sm:grid-cols-[0.95fr_1.05fr]">
          <div className={`rounded-[1.4rem] bg-gradient-to-br ${frame} p-[1px]`}>
            <div className="relative overflow-hidden rounded-[calc(1.4rem-1px)] bg-[#0f1222]">
              <div className="absolute inset-0 opacity-40">
                <MagicalGlyph type={gift.timeframe} />
              </div>
              <img
                src={gift.imageUrl}
                alt={gift.name}
                className="relative h-full min-h-36 w-full object-cover opacity-85"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/12 bg-black/35 px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-amber-50/90">
                  {timeframeShortLabels[gift.timeframe]}
                </span>
                <span className="rounded-full border border-white/12 bg-black/35 px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-amber-50/90">
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

            <div className="flex items-center justify-between gap-3">
              <p className="text-base font-medium text-amber-50">{currency(gift.price)}</p>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-100/70">
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

function MagicalGlyph({ type }: { type: Exclude<GiftTimeframe, "ANY"> }) {
  const palette = {
    SHORT: ["#2dd4bf", "#60a5fa"],
    MEDIUM: ["#f59e0b", "#fbbf24"],
    LONG: ["#fb7185", "#c084fc"],
  }[type];

  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`glyph-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette[0]} />
          <stop offset="100%" stopColor={palette[1]} />
        </linearGradient>
      </defs>
      <rect width="320" height="220" fill="rgba(255,255,255,0.03)" />
      <circle cx="92" cy="100" r="58" fill={`url(#glyph-${type})`} opacity="0.35" />
      <path
        d="M178 54l16 32 35 5-25 24 6 34-32-17-32 17 6-34-25-24 35-5 16-32z"
        fill={`url(#glyph-${type})`}
        opacity="0.45"
      />
      <circle cx="232" cy="154" r="26" fill={`url(#glyph-${type})`} opacity="0.32" />
    </svg>
  );
}

function WizardCard({ item }: { item: WizardGalleryItem }) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-[#121325]/90 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.35)]">
      <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-3">
        <item.icon />
      </div>
      <div className="mt-3">
        <p className="text-xs uppercase tracking-[0.26em] text-amber-100/55">{item.kind}</p>
        <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-50">
          {item.name}
        </h3>
        <p className="mt-2 text-sm leading-6 text-amber-100/70">{item.description}</p>
      </div>
    </article>
  );
}

type WizardGalleryItem = {
  kind: string;
  name: string;
  description: string;
  icon: () => JSX.Element;
};

const wizardGallery: WizardGalleryItem[] = [
  {
    kind: "Personagem",
    name: "Harry",
    description: "Óculos, cicatriz e coragem desenhados de forma original.",
    icon: HarryGlyph,
  },
  {
    kind: "Personagem",
    name: "Hermione",
    description: "Livro, brilho e postura de quem sempre encontrou a resposta.",
    icon: HermioneGlyph,
  },
  {
    kind: "Item",
    name: "Varinha",
    description: "Um feixe de luz, madeira e faísca de encantamento.",
    icon: WandGlyph,
  },
  {
    kind: "Lugar",
    name: "Hogwarts",
    description: "Torre, lua e janelas acesas em noite de aventura.",
    icon: CastleGlyph,
  },
  {
    kind: "Personagem",
    name: "Dobby",
    description: "Olhar esperto e orelhas grandes em silhueta simpática.",
    icon: DobbyGlyph,
  },
  {
    kind: "Personagem",
    name: "Dumbledore",
    description: "Barba longa, estrela e calma de diretor lendário.",
    icon: DumbledoreGlyph,
  },
  {
    kind: "Bicho",
    name: "Coruja",
    description: "Voadora, atenta e mensageira do cofre.",
    icon: OwlGlyph,
  },
  {
    kind: "Bicho",
    name: "Hagrid",
    description: "Grande presença, coração generoso e lanterna acesa.",
    icon: HagridGlyph,
  },
];

function HarryGlyph() {
  return <WizardPortrait variant="harry" />;
}

function HermioneGlyph() {
  return <WizardPortrait variant="hermione" />;
}

function WandGlyph() {
  return <WizardObject variant="wand" />;
}

function CastleGlyph() {
  return <WizardObject variant="castle" />;
}

function DobbyGlyph() {
  return <WizardPortrait variant="dobby" />;
}

function DumbledoreGlyph() {
  return <WizardPortrait variant="dumbledore" />;
}

function OwlGlyph() {
  return <WizardObject variant="owl" />;
}

function HagridGlyph() {
  return <WizardPortrait variant="hagrid" />;
}

function WizardPortrait({ variant }: { variant: "harry" | "hermione" | "dobby" | "dumbledore" | "hagrid" }) {
  const accent =
    variant === "hermione"
      ? "#60a5fa"
      : variant === "dobby"
        ? "#f8b4d9"
        : variant === "dumbledore"
          ? "#fbbf24"
          : variant === "hagrid"
            ? "#c084fc"
            : "#f59e0b";

  return (
    <svg viewBox="0 0 220 220" className="h-40 w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`portrait-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <rect width="220" height="220" rx="24" fill="rgba(255,255,255,0.03)" />
      <circle cx="110" cy="76" r="32" fill={`url(#portrait-${variant})`} />
      <path
        d="M58 190c8-36 28-56 52-56s44 20 52 56"
        fill={`url(#portrait-${variant})`}
        opacity="0.7"
      />
      {variant === "harry" ? (
        <>
          <circle cx="95" cy="74" r="6" fill="#0f172a" />
          <circle cx="125" cy="74" r="6" fill="#0f172a" />
          <rect x="100" y="73" width="20" height="2" rx="1" fill="#0f172a" />
          <path d="M110 30l8 18-14 6 10 8" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        </>
      ) : null}
      {variant === "hermione" ? (
        <>
          <path d="M78 58c14-20 50-20 64 0" fill="none" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
          <path d="M88 92c10 12 34 12 44 0" fill="none" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
          <path d="M84 40h52" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
          <path d="M150 120l16 20" stroke={accent} strokeWidth="6" strokeLinecap="round" />
        </>
      ) : null}
      {variant === "dobby" ? (
        <>
          <path d="M70 80l-18-24 14 4 10 16" fill={accent} opacity="0.8" />
          <path d="M150 80l18-24-14 4-10 16" fill={accent} opacity="0.8" />
          <circle cx="110" cy="84" r="6" fill="#0f172a" />
          <circle cx="92" cy="80" r="5" fill="#0f172a" />
          <circle cx="128" cy="80" r="5" fill="#0f172a" />
        </>
      ) : null}
      {variant === "dumbledore" ? (
        <>
          <path d="M92 70c8-18 28-18 36 0" fill="none" stroke="#0f172a" strokeWidth="5" />
          <path d="M78 122c18 34 46 34 64 0" fill="none" stroke="#f8fafc" strokeWidth="10" strokeLinecap="round" />
          <circle cx="110" cy="50" r="6" fill={accent} />
        </>
      ) : null}
      {variant === "hagrid" ? (
        <>
          <path d="M78 68c10-16 54-16 64 0" fill="none" stroke="#0f172a" strokeWidth="5" />
          <path d="M84 122c14 26 38 26 52 0" fill="none" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
          <circle cx="72" cy="130" r="8" fill={accent} opacity="0.6" />
        </>
      ) : null}
      <circle cx="110" cy="76" r="32" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
    </svg>
  );
}

function WizardObject({ variant }: { variant: "wand" | "castle" | "owl" }) {
  return (
    <svg viewBox="0 0 220 220" className="h-40 w-full" aria-hidden="true">
      <rect width="220" height="220" rx="24" fill="rgba(255,255,255,0.03)" />
      {variant === "wand" ? (
        <>
          <path d="M52 168l116-116" stroke="#fbbf24" strokeWidth="12" strokeLinecap="round" />
          <path d="M136 48l28-12-12 28" fill="none" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="54" cy="166" r="10" fill="#f59e0b" opacity="0.6" />
        </>
      ) : null}
      {variant === "castle" ? (
        <>
          <path d="M58 172h104v-54H58z" fill="#3b82f6" opacity="0.45" />
          <path d="M72 118V78l22 20 22-20 22 20 22-20v40" fill="#60a5fa" opacity="0.55" />
          <path d="M96 172v-38h28v38" fill="#dbeafe" opacity="0.6" />
          <circle cx="160" cy="56" r="20" fill="#fbbf24" opacity="0.5" />
        </>
      ) : null}
      {variant === "owl" ? (
        <>
          <ellipse cx="110" cy="118" rx="42" ry="36" fill="#f59e0b" opacity="0.35" />
          <circle cx="92" cy="112" r="8" fill="#0f172a" />
          <circle cx="128" cy="112" r="8" fill="#0f172a" />
          <path d="M110 120l-8 12h16z" fill="#fbbf24" />
          <path d="M72 74l18 18M148 74l-18 18" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : null}
    </svg>
  );
}
