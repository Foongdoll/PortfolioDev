import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ===== 데이터/타입 ===== */
type SideProject = {
  id: string;
  title: string;
  period?: string;
  summary: string;
  status?: "Active" | "Archived" | "Paused";
  type?: "App" | "Web" | "Library" | "CLI" | "Design";
  stack: string[];
  tags?: string[];
  cover?: string;
  github?: string;
  live?: string;
  phase?: { plan: number; design: number; build: number; ship: number };
  highlights?: string[];
  problems?: string[];
  solutions?: string[];
};

const SIDE_PROJECTS: SideProject[] = [
  {
    id: "note-electron-suite",
    title: "Note – Electron Productivity Suite",
    period: "2025.06 – 2025.07",
    summary:
      "Electron + React 기반의 오프라인 생산성 데스크톱 앱으로, 마크다운 노트 · 플래시카드 학습 · 일정 관리를 하나의 워크스페이스에 통합했습니다.",
    status: "Active",
    type: "App",
    stack: [
      "TypeScript",
      "React 18",
      "Electron 37",
      "Vite 7",
      "Tailwind CSS 4",
      "Framer Motion",
      "date-fns",
      "@uiw/react-md-editor",
    ],
    tags: [
      "Productivity",
      "Knowledge Base",
      "Flashcards",
      "Calendar",
      "Offline-first",
    ],
    cover: "src/assets/icon.ico",
    phase: { plan: 100, design: 90, build: 80, ship: 60 },
    highlights: [
      "폴더 트리·노트 메타·실시간 마크다운 미리보기를 묶은 듀얼 패널 편집 경험과 자동 저장 흐름을 구축했습니다.",
      "플래시카드를 폴더별로 분류하고 즉시 편집/학습/플립 전환이 가능한 학습 모드를 설계했습니다.",
      "일정 탭에서 다중 일자 이벤트를 집계하고 PDF/CSV/XLS 내보내기를 지원해 데이터 활용 범위를 넓혔습니다.",
    ],
    problems: [
      "모든 노트를 단일 JSON에 저장하던 구 버전은 10MB 이상에서 렌더러 성능이 급락하고 충돌 위험이 있었습니다.",
      "사용자 이미지를 외부 경로로 링크하면 환경이 바뀔 때마다 깨지는 문제가 재발했습니다.",
    ],
    solutions: [
      "노트 메타와 본문을 분리한 파일 구조로 재설계하고 최초 실행 시 마이그레이션을 수행해 기존 데이터를 안전하게 이전했습니다.",
      "이미지 경로를 userData 기반으로 정규화하고 사용되지 않는 파일을 주기적으로 정리하는 유틸을 추가했습니다.",
    ],
  },
  {
    id: "flowin-ledger",
    title: "FLOWIN Ledger",
    period: "2025.09 ~ 2025.10",
    summary:
      "원화와 달러를 동시에 다루는 프리랜서를 위해 환전·투자·일반 거래를 한 화면에서 관리하는 데스크톱 가계부. Electron 기반 오프라인 저장소와 리치 시각화로 민감한 재무 데이터를 안전하게 분석한다.",
    status: "Active",
    type: "App",
    stack: ["TypeScript", "React 18", "Electron 31", "Chart.js 4", "Node.js"],
    tags: ["Fintech", "Multi-currency", "Desktop", "Solo"],
    phase: { plan: 90, design: 85, build: 80, ship: 60 },
    highlights: [
      "Electron 메인 프로세스에서 entries.jsonl/fxrates.json 등을 원자적으로 관리해 완전 로컬 퍼시스턴스를 구현, 민감 데이터를 외부 전송 없이 보관.",
      "거래·환전·보유자산 3단 뷰와 토스트/확인 모달을 통해 데스크톱에 최적화된 워크플로를 설계.",
      "Chart.js 기반 일별 흐름, 누적 잔액, 카테고리별 파이 차트로 다각적인 현금흐름 인사이트 제공.",
      "주식 보유·거래 CRUD와 계좌/태그/기간 필터로 멀티 계정 재무를 한 번에 조망.",
    ],
    problems: [
      "원화와 달러 수입을 병행하는 프리랜서가 일자·계좌별 정산을 스프레드시트로 반복 입력해야 했음.",
      "환전 기록과 실제 보유 현금·투자 잔액이 분리되어 의사결정에 필요한 실시간 흐름을 파악하기 어려웠음.",
      "거래 데이터가 민감해 클라우드 가계부에 업로드하기 부담스러웠음.",
    ],
    solutions: [
      "Electron 메인 프로세스에서 JSONL/JSON 파일을 관리해 오프라인·자체 저장소 구축 (entries.jsonl, fxrates.json 등).",
      "환율 Resolver와 평가 로직으로 USD 거래를 KRW로 자동 환산하고 누락된 환율을 즉시 경고.",
      "Charts·Stats·Insights 패널로 기간별 수익·지출·계좌 잔액을 시각화하여 행동 가능한 지표 제공.",
      "환전 카드와 HoldingsPanel CRUD로 실제 환전·주식 거래 흐름까지 한 앱에서 기록.",
    ],
  },
  {
    id: "dailyon",
    title: "Dailyon – AI Productivity Companion",
    period: "2024.08 – 진행중",
    summary:
      "하루의 일정·메모·가계부를 하나의 PWA로 묶고, 로컬 3B + 클라우드 7B 하이브리드 AI가 자동 요약·추천을 제공하는 개인 시너지 허브입니다.",
    status: "Active",
    type: "App",
    stack: [
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind CSS 4",
      "Zustand",
      "TanStack Query",
      "dnd-kit",
      "Spring Boot 3",
      "JPA",
      "MySQL",
      "Redis",
      "JWT",
      "WebSocket",
      "OpenAPI",
    ],
    tags: ["AI", "PWA", "Productivity", "Spring Boot", "React"],
    phase: { plan: 90, design: 85, build: 65, ship: 40 },
    highlights: [
      "로컬 3B + 클라우드 7B 모델을 오케스트레이션해 메모 요약·태그 추천을 실시간으로 제공했습니다.",
      "드래그앤드롭 메모 보드와 카테고리별 커스텀 필드 엔진으로 다양한 기록 포맷을 한 화면에서 구성했습니다.",
      "JWT + Refresh 토큰 자동 재발급과 Axios 인터셉터로 유저 세션을 끊김 없이 유지했습니다.",
      "Spring Boot 모듈 구조와 WebSocket 파이프라인을 도입해 일정·채팅·메모 이벤트를 실시간 확장할 수 있게 설계했습니다.",
    ],
    problems: [
      "카테고리마다 서로 다른 메모 필드 스키마를 안정적으로 렌더링해야 했습니다.",
      "드래그앤드롭 메모 보드 레이아웃이 기기마다 달라지는 문제를 맞닥뜨렸습니다.",
      "AI 호출이 잦아지면 응답 지연과 비용이 급증할 우려가 있었습니다.",
    ],
    solutions: [
      "NoteCategory 모델과 JSON 기반 필드 정의, 타입 안전한 렌더러를 만들어 카테고리별 필드를 일관되게 처리했습니다.",
      "layout 패치 API와 낙관적 업데이트, dnd-kit의 `arrayMove`를 활용해 보드 좌표를 서버와 동기화했습니다.",
      "로컬 경량 모델과 클라우드 대형 모델을 분기하는 AI 오케스트레이터에 캐시와 우선순위 큐를 더해 지연과 비용을 최적화했습니다.",
    ],
  },
];

/* ===== 유틸: 상태 뱃지 색 ===== */
const statusStyle = (s?: SideProject["status"]) => {
  switch (s) {
    case "Active":
      return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "Paused":
      return "text-amber-700 bg-amber-50 border-amber-200";
    case "Archived":
      return "text-slate-700 bg-slate-50 border-slate-200";
    default:
      return "text-slate-700 bg-slate-50 border-slate-200";
  }
};
const typeStyle = (t?: SideProject["type"]) => {
  switch (t) {
    case "App":
      return "text-sky-700 bg-sky-50 border-sky-200";
    case "Web":
      return "text-indigo-700 bg-indigo-50 border-indigo-200";
    case "Library":
      return "text-violet-700 bg-violet-50 border-violet-200";
    case "CLI":
      return "text-rose-700 bg-rose-50 border-rose-200";
    case "Design":
      return "text-emerald-700 bg-emerald-50 border-emerald-200";
    default:
      return "text-slate-700 bg-slate-50 border-slate-200";
  }
};

const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));

/* ===== 진행바 컴포넌트 ===== */
function PhaseBar({ label, value = 0 }: { label: string; value?: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px] text-slate-600">
        <span>{label}</span>
        <span>{v}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-400"
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}

/* ===== 메인 ===== */
export default function Projects() {
  // 검색/필터
  const [q, setQ] = useState("");
  const allStacks = useMemo(
    () => uniq(SIDE_PROJECTS.flatMap((p) => p.stack)).sort(),
    []
  );
  const [activeStacks, setActiveStacks] = useState<string[]>([]);
  const [type, setType] = useState<SideProject["type"] | "All">("All");
  const [sortBy, setSortBy] = useState<"recent" | "title">("recent");

  // 카드 확장 전환용
  const [expanded, setExpanded] = useState<string | null>(null);

  // 카드별 "스택 더보기" 상태
  const [expandedStacksMap, setExpandedStacksMap] = useState<
    Record<string, boolean>
  >({});

  const toggleStacks = (id: string) => {
    setExpandedStacksMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 필터링된 프로젝트 리스트
  const list = useMemo(() => {
    let rows = SIDE_PROJECTS.slice();
    const v = q.trim().toLowerCase();

    if (v) {
      rows = rows.filter(
        (p) =>
          p.title.toLowerCase().includes(v) ||
          p.summary.toLowerCase().includes(v) ||
          (p.tags ?? []).some((t) => t.toLowerCase().includes(v))
      );
    }

    if (type !== "All") {
      rows = rows.filter((p) => p.type === type);
    }

    if (activeStacks.length) {
      rows = rows.filter((p) =>
        activeStacks.every((s) => p.stack.includes(s))
      );
    }

    if (sortBy === "recent") {
      rows.sort((a, b) => (b.period ?? "").localeCompare(a.period ?? ""));
    } else {
      rows.sort((a, b) => a.title.localeCompare(b.title));
    }

    return rows;
  }, [q, type, activeStacks, sortBy]);

  const toggleStackFilter = (s: string) =>
    setActiveStacks((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-sky-50 via-white to-indigo-50 text-slate-800">
      {/* Hero */}
      <header className="mx-auto max-w-7xl px-6 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <span className="text-sky-500 text-3xl font-black">&lt;/&gt;</span>
          <h1 className="text-4xl md:text-5xl font-bold">Side Projects</h1>
        </div>
        <p className="mt-3 max-w-2xl text-slate-600">
          개인적으로 탐구하고 구축한 프로젝트들을 모았습니다. 간단한 실험부터
          배포/운영까지—기획·설계·개발·배포 플로우와 문제 해결 과정을 함께
          보여드립니다.
        </p>
      </header>

      {/* Controls */}
      <section className="mx-auto max-w-7xl px-6 pb-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          {/* 검색 */}
          <div className="lg:col-span-5">
            <label className="sr-only" htmlFor="q">
              검색
            </label>
            <input
              id="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="검색: 제목・요약・태그"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>

          {/* 타입 + 정렬 */}
          <div className="lg:col-span-3 flex gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
            >
              <option value="All">All types</option>
              <option value="App">App</option>
              <option value="Web">Web</option>
              <option value="Library">Library</option>
              <option value="CLI">CLI</option>
              <option value="Design">Design</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
            >
              <option value="recent">Sort: Recent</option>
              <option value="title">Sort: Title</option>
            </select>
          </div>

          {/* 스택 필터 칩들 (전체 기술 목록에서 필터용) */}
          <div className="lg:col-span-4 absolute w-50 right-[10%] rounded-3xl p-5 border-2 border-blue-200">
            <div className="flex flex-wrap gap-2">
              {allStacks.map((s) => {
                const active = activeStacks.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleStackFilter(s)}
                    className={[
                      "rounded-full border px-3 py-1.5 text-xs shadow-sm transition",
                      active
                        ? "bg-sky-50 text-sky-700 border-sky-200"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Grid + 카드 */}
      <main className="mx-auto max-w-7xl px-6 pb-16">
        {list.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            조건에 맞는 프로젝트가 없어요. 필터를 조정해 보세요.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((p) => {
                const isCardOpen = expanded === p.id;
                const showAllStacks = !!expandedStacksMap[p.id];

                // 6개 이후는 접기
                const PREVIEW_COUNT = 6;
                const previewStacks = p.stack.slice(0, PREVIEW_COUNT);
                const hiddenStacks = p.stack.slice(PREVIEW_COUNT);

                return (
                  <motion.article
                    key={p.id}
                    layoutId={`card-${p.id}`}
                    className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
                  >
                    {/* 커버 */}
                    <motion.div
                      layoutId={`cover-${p.id}`}
                      className="relative overflow-hidden rounded-t-2xl"
                    >
                      {p.cover ? (
                        <img
                          src={p.cover}
                          alt={`${p.title} cover`}
                          className="h-40 w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-40 w-full bg-gradient-to-br from-sky-50 to-indigo-50" />
                      )}
                    </motion.div>

                    {/* 본문 */}
                    <motion.div layout="position" className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <motion.h3
                          layoutId={`title-${p.id}`}
                          className="text-lg font-semibold text-slate-900"
                        >
                          {p.title}
                        </motion.h3>
                        <div className="flex gap-1">
                          {p.type && (
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${typeStyle(
                                p.type
                              )}`}
                            >
                              {p.type}
                            </span>
                          )}
                          {p.status && (
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${statusStyle(
                                p.status
                              )}`}
                            >
                              {p.status}
                            </span>
                          )}
                        </div>
                      </div>

                      {p.period && (
                        <div className="mt-1 text-xs text-slate-500">
                          {p.period}
                        </div>
                      )}

                      <p className="mt-2 line-clamp-3 text-sm text-slate-700">
                        {p.summary}
                      </p>

                      {/* 진행바 */}
                      {p.phase && (
                        <div className="mt-4 space-y-2">
                          <PhaseBar label="기획" value={p.phase.plan} />
                          <PhaseBar label="설계" value={p.phase.design} />
                          <PhaseBar label="개발" value={p.phase.build} />
                          <PhaseBar label="배포" value={p.phase.ship} />
                        </div>
                      )}

                      {/* 스택 영역: 기본 6개 + 더보기 토글 */}
                      <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-600">
                        <div className="flex flex-wrap items-center gap-2">
                          {previewStacks.map((s) => (
                            <span
                              key={s}
                              className="rounded-md bg-slate-50 border border-slate-200 px-2 py-1"
                            >
                              {s}
                            </span>
                          ))}

                          <AnimatePresence initial={false}>
                            {showAllStacks &&
                              hiddenStacks.map((s) => (
                                <motion.span
                                  key={s}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  transition={{
                                    duration: 0.18,
                                    ease: "easeOut",
                                  }}
                                  className="rounded-md bg-slate-50 border border-slate-200 px-2 py-1"
                                >
                                  {s}
                                </motion.span>
                              ))}
                          </AnimatePresence>

                          {hiddenStacks.length > 0 && (
                            <button
                              onClick={() => toggleStacks(p.id)}
                              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-50"
                            >
                              {showAllStacks
                                ? "접기"
                                : `+${hiddenStacks.length} 더보기`}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* 액션 버튼 */}
                      <div className="mt-4 flex items-center gap-3">
                        {p.github && (
                          <a
                            href={p.github}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-sky-700 underline decoration-sky-300 hover:text-sky-600"
                          >
                            GitHub
                          </a>
                        )}
                        {p.live && (
                          <a
                            href={p.live}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-sky-700 underline decoration-sky-300 hover:text-sky-600"
                          >
                            Live
                          </a>
                        )}
                        <button
                          onClick={() =>
                            setExpanded((id) => (id === p.id ? null : p.id))
                          }
                          className="ml-auto rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                          aria-expanded={isCardOpen}
                        >
                          {isCardOpen ? "간단히 보기" : "자세히 보기"}
                        </button>
                      </div>
                    </motion.div>
                  </motion.article>
                );
              })}
            </div>

            {/* 확장된 카드 (모달처럼 덮지만 실제로는 레이아웃 전환) */}
            <AnimatePresence>
              {expanded && (
                <motion.section
                  key="expanded"
                  className="fixed inset-0 z-[60] overflow-y-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  {/* 살짝 밝은 배경 (클릭 막진 않음) */}
                  <motion.div
                    className="pointer-events-none fixed inset-0 bg-gradient-to-b from-white/70 to-sky-50/40"
                    aria-hidden
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  />

                  {(() => {
                    const p = SIDE_PROJECTS.find((x) => x.id === expanded)!;
                    return (
                      <motion.article
                        layoutId={`card-${p.id}`}
                        className="mx-auto my-8 w-[min(1100px,92vw)] rounded-3xl border border-slate-200 bg-white shadow-xl"
                        transition={{
                          type: "spring",
                          stiffness: 80,
                          damping: 20,
                          mass: 0.6,
                        }}
                      >
                        {/* 커버: height 크게 (요구사항 3) */}
                        <motion.div
                          layoutId={`cover-${p.id}`}
                          className="relative overflow-hidden rounded-t-3xl"
                        >
                          {p.cover ? (
                            <img
                              src={p.cover}
                              alt={`${p.title} cover`}
                              className="h-[40vh] w-full object-cover md:h-[55vh]"
                            />
                          ) : (
                            <div className="h-[40vh] w-full bg-gradient-to-br from-sky-50 to-indigo-50 md:h-[55vh]" />
                          )}

                          <button
                            onClick={() => setExpanded(null)}
                            className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs text-slate-700 shadow hover:bg-white"
                            aria-label="닫기"
                          >
                            닫기 ✕
                          </button>
                        </motion.div>

                        <motion.div
                          layout="position"
                          className="p-6 md:p-8"
                          transition={{
                            type: "spring",
                            stiffness: 80,
                            damping: 20,
                            mass: 0.6,
                          }}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <motion.h2
                              layoutId={`title-${p.id}`}
                              className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl"
                            >
                              {p.title}
                            </motion.h2>
                            <div className="flex gap-2">
                              {p.type && (
                                <span
                                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${typeStyle(
                                    p.type
                                  )}`}
                                >
                                  {p.type}
                                </span>
                              )}
                              {p.status && (
                                <span
                                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${statusStyle(
                                    p.status
                                  )}`}
                                >
                                  {p.status}
                                </span>
                              )}
                            </div>
                          </div>

                          {p.period && (
                            <p className="mt-1 text-xs text-slate-500">
                              {p.period}
                            </p>
                          )}

                          {/* 상세 컨텐츠 */}
                          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-5">
                            {/* 왼쪽: 설명 */}
                            <div className="md:col-span-3 space-y-4 text-sm text-slate-700">
                              <p>{p.summary}</p>

                              {p.highlights?.length ? (
                                <div>
                                  <h3 className="text-sm font-semibold text-slate-900">
                                    하이라이트
                                  </h3>
                                  <ul className="mt-1 list-disc pl-5">
                                    {p.highlights.map((h) => (
                                      <li key={h}>{h}</li>
                                    ))}
                                  </ul>
                                </div>
                              ) : null}

                              {p.problems?.length ? (
                                <div>
                                  <h3 className="text-sm font-semibold text-slate-900">
                                    문제/도전
                                  </h3>
                                  <ul className="mt-1 list-disc pl-5">
                                    {p.problems.map((h) => (
                                      <li key={h}>{h}</li>
                                    ))}
                                  </ul>
                                </div>
                              ) : null}

                              {p.solutions?.length ? (
                                <div>
                                  <h3 className="text-sm font-semibold text-slate-900">
                                    해결/학습
                                  </h3>
                                  <ul className="mt-1 list-disc pl-5">
                                    {p.solutions.map((h) => (
                                      <li key={h}>{h}</li>
                                    ))}
                                  </ul>
                                </div>
                              ) : null}
                            </div>

                            {/* 오른쪽: 진행도 / 스택 / 링크 */}
                            <div className="md:col-span-2 space-y-4">
                              {p.phase && (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                  <h3 className="text-sm font-semibold text-slate-900">
                                    진행 단계
                                  </h3>
                                  <div className="mt-3 space-y-2">
                                    <PhaseBar
                                      label="기획"
                                      value={p.phase.plan}
                                    />
                                    <PhaseBar
                                      label="설계"
                                      value={p.phase.design}
                                    />
                                    <PhaseBar
                                      label="개발"
                                      value={p.phase.build}
                                    />
                                    <PhaseBar
                                      label="배포"
                                      value={p.phase.ship}
                                    />
                                  </div>
                                </div>
                              )}

                              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <h3 className="text-sm font-semibold text-slate-900">
                                  기술 스택
                                </h3>
                                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-700">
                                  {p.stack.map((s) => (
                                    <span
                                      key={s}
                                      className="rounded-md bg-white border border-slate-200 px-2 py-1"
                                    >
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                {p.github && (
                                  <a
                                    href={p.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-sky-700 underline decoration-sky-300 hover:text-sky-600"
                                  >
                                    GitHub
                                  </a>
                                )}
                                {p.live && (
                                  <a
                                    href={p.live}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-sky-700 underline decoration-sky-300 hover:text-sky-600"
                                  >
                                    Live
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </motion.article>
                    );
                  })()}
                </motion.section>
              )}
            </AnimatePresence>
          </>
        )}
      </main>
    </div>
  );
}
