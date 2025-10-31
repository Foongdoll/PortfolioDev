import { useMemo } from "react";

export type AboutData = {
  tagline: string;
  values: string[];
  impact: { label: string; value: string; note?: string }[];
  skills: { group: string; items: string[] }[];
  projects: {
    title: string;
    problem?: string;
    actions?: string[];
    result?: string;
    metrics?: string[];
    links?: { label: string; url: string }[];
  }[];
  timeline: { date: string; title: string; note?: string }[];
  nowNext: { now: string[]; next: string[] };
  links: { label: string; url: string }[];
  ctas: { label: string; href: string }[];
};

const exampleAboutData: AboutData = {
  tagline: "사용자와 팀이 체감하는 가치를 만드는 풀스택 개발자",

  values: [
    "문제를 구조적으로 파악하고, 근본 원인을 찾습니다.",
    "데이터 기반으로 가설을 세우고 검증합니다.",
    "팀 간 의사소통을 단순화하고, 문서화로 신뢰를 쌓습니다.",
    "코드는 읽히는 예술이며, 유지보수성이 가장 큰 생산성입니다.",
    "관찰 가능한 시스템(Observability)을 우선시합니다.",
    "단순하지만 강력한 사용자 경험을 추구합니다."
  ],

  impact: [
    { label: "API P95 응답시간", value: "900ms → 280ms", note: "FillMe 서비스" },
    { label: "Crash-Free 세션율", value: "96% → 99.2%", note: "FillMe 앱 안정화" },
    { label: "배포 리드타임", value: "−70%", note: "DevOps-Hub 자동화 파이프라인" },
    { label: "SSH/SFTP 오류율", value: "−90%", note: "DevOps-Hub SFTP 개선" },
    { label: "사이니지 재생 실패율", value: "3.1% → 0.6%", note: "인사동 관광 사이니지" }
  ],

  skills: [
    { group: "Frontend", items: ["React", "Vite", "TailwindCSS", "Zustand", "TanStack Query", "TypeScript"] },
    { group: "Backend", items: ["Spring Boot", "NestJS", "MySQL", "Redis", "JPA", "JWT", "REST API"] },
    { group: "Mobile/Desktop", items: ["React Native", "Electron", "Expo"] },
    { group: "DevOps", items: ["Docker", "GitHub Actions", "AWS EC2/S3", "Nginx", "Terraform", "PM2"] },
    { group: "Etc", items: ["CI/CD", "OAuth2", "Clean Architecture", "Git", "PWA", "Accessibility(A11y)"] }
  ],

  projects: [
    {
      title: "FillMe - 건강관리 AI 추천 앱",
      problem: "API 응답 지연과 인증 세션 만료로 사용자 이탈 발생",
      actions: [
        "JWT + OAuth2 기반 인증 및 세션 구조 재설계",
        "MySQL 인덱싱 및 쿼리 튜닝으로 추천 속도 69% 단축",
        "GitHub Actions + EC2 기반 자동 배포 구성",
        "사용자 행동 로그 기반 추천 로직 개선"
      ],
      result: "Crash-Free 99.2%, P95 응답속도 900→280ms 달성, 유지율 +18%",
      metrics: [
        "API 응답시간 900ms → 280ms",
        "Crash-Free 세션율 96% → 99.2%",
        "7일 유지율 +18%"
      ],
      links: [
        { label: "GitHub", url: "https://github.com/Foongdoll/FillMe" },
        { label: "App Store", url: "https://apps.apple.com/kr/app/fillme-1%EB%B6%84/id1640130403" }
      ]
    },
    {
      title: "DevOps-Hub – Git/SSH/SFTP 통합 개발 플랫폼",
      problem: "다수의 터미널과 FTP 툴을 병행해야 하는 비효율",
      actions: [
        "SSH2 기반 실시간 터미널 + SFTP 트리 UI 구현",
        "Git 모듈(Commit, Push, Stage 등) 자동화",
        "Electron + NestJS 통합 환경 구축",
        "Docker + GitHub Actions CI/CD 자동화"
      ],
      result: "형상관리/배포 효율 70% 향상, SSH 오류율 90% 감소",
      metrics: [
        "배포 리드타임 −70%",
        "SSH/SFTP 오류율 −90%",
        "세션 전환 속도 2.5× 개선"
      ],
      links: [
        { label: "GitHub", url: "https://github.com/Foongdoll/DevOps-Hub" },
        { label: "Service", url: "http://13.124.87.223/portfolio" }
      ]
    },
    {
      title: "인사동 한복착장 사이니지 시스템",
      problem: "네트워크 불안정으로 영상 중단 및 수동 콘텐츠 관리",
      actions: [
        "Redis 캐시 및 콘텐츠 스케줄러 설계",
        "파일버전 기반 롤백/배포 자동화",
        "다국어 자막 및 관광 API 연동",
        "WebSocket 기반 Unity 동기화 프로토콜 구축"
      ],
      result: "재생 민원 70% 감소, 배포 속도 60% 향상",
      metrics: [
        "재생 실패율 3.1% → 0.6%",
        "콘텐츠 롤아웃 −60%",
        "배포 오류 0건 (3개월)"
      ],
      links: []
    }
  ],

  timeline: [
    { date: "2022.09", title: "풀스택 부트캠프 수료 (900시간)", note: "Java, Spring, React 기반" },
    { date: "2023.05", title: "이노베이션티 입사", note: "백엔드 및 풀스택 개발 담당" },
    { date: "2024.07", title: "DevOps-Hub 개인 프로젝트 개발", note: "형상관리·배포 자동화 플랫폼" },
    { date: "2025.01", title: "Flowin 기획 및 디자인", note: "라이프 매니지먼트·AI 플래너 앱" }
  ],

  nowNext: {
    now: [
      "Electron + React 기반 데스크탑 앱 최적화",
      "AI 요약/질문 생성 기능 고도화",
      "Flowin 플래너 UI 개선 및 성능 튜닝"
    ],
    next: [
      "LLM 기반 개인 비서 기능 추가",
      "CI/CD 워크플로우 고도화 및 모듈화",
      "AWS 인프라 IaC 완전 자동화(Terraform)"
    ]
  },

  links: [
    { label: "GitHub", url: "https://github.com/Foongdoll" },
    { label: "Portfolio", url: "https://foongdoll.dev" },
    { label: "Blog", url: "https://dailyon.vercel.app" }
  ],

  ctas: [    
    { label: "💻 GitHub", href: "https://github.com/Foongdoll" },
    { label: "🧾 이력서 다운로드", href: "/resume.pdf" }
  ]
};

type AboutProps = {
  aboutData?: AboutData;
};

/* 🎨 라이트 테마용 카드 베이스 */
const cardBase =
  "group rounded-2xl border border-slate-200 bg-white shadow-sm transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md focus-within:-translate-y-0.5 focus-within:shadow-md";

/* 라이트 테마 CTA 버튼 */
function CTAButton({ href, label }: { href: string; label: string }) {
  if (!href || !label) return null;
  return (
    <a
      href={href}
      aria-label={`Open ${label}`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
    >
      <span>{label}</span>
      <span aria-hidden className="text-xs text-slate-400">-&gt;</span>
    </a>
  );
}

export default function About({ aboutData = exampleAboutData }: { aboutData?: AboutData }) {
  const {
    tagline,
    values = [],
    impact = [],
    skills = [],
    projects = [],
    timeline = [],
    nowNext = { now: [], next: [] },
    links = [],
    ctas = [],
  } = aboutData ?? exampleAboutData;

  const safeNow = nowNext?.now ?? [];
  const safeNext = nowNext?.next ?? [];
  const filteredLinks = useMemo(
    () => (links ?? []).filter((l) => l?.label && l?.url),
    [links]
  );
  const filteredCTAs = useMemo(
    () => (ctas ?? []).filter((c) => c?.label && c?.href).slice(0, 3),
    [ctas]
  );

  return (
    <main className="relative w-full min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 text-slate-800">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 md:gap-14 md:px-6 lg:px-8">
        {/* Hero */}
        <header aria-label="About hero" className="flex flex-col gap-4 text-center md:gap-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">About</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            <span className="align-middle mr-2 text-sky-500 font-black">&lt;/&gt;</span>
            {tagline?.trim() ? tagline : "--"}
          </h1>
          {filteredLinks.length > 0 && (
            <nav aria-label="Quick links" className="flex flex-wrap justify-center gap-3 text-sm">
              {filteredLinks.map((link, idx) => (
                <a
                  key={`${link.label}-${idx}`}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  {link.label}
                  <span aria-hidden className="text-xs text-slate-400">-&gt;</span>
                </a>
              ))}
            </nav>
          )}
        </header>

        {/* Values */}
        {values.length > 0 && (
          <section aria-labelledby="about-values" className="flex flex-col gap-4">
            <div>
              <h2 id="about-values" className="text-2xl md:text-3xl font-semibold text-slate-900">Working Principles</h2>
              <p className="mt-1 text-sm text-slate-500">Predictable delivery, clear communication, measurable outcomes</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {values.map((value, idx) => (
                <article key={idx} className={`${cardBase} p-6`} tabIndex={0}>
                  <p className="text-base font-medium text-slate-800">{value || "--"}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Impact */}
        {impact.length > 0 && (
          <section aria-labelledby="about-impact" className="flex flex-col gap-4">
            <div>
              <h2 id="about-impact" className="text-2xl md:text-3xl font-semibold text-slate-900">Impact</h2>
              <p className="mt-1 text-sm text-slate-500">Headline metrics from shipped work</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {impact.map((item, idx) => (
                <article key={idx} className={`${cardBase} p-6`} tabIndex={0}>
                  <p className="text-sm font-medium text-slate-500">{item?.label || "--"}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{item?.value || "--"}</p>
                  {item?.note && <p className="mt-3 text-sm text-slate-600 line-clamp-3">{item.note}</p>}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section aria-labelledby="about-skills" className="flex flex-col gap-4">
            <div>
              <h2 id="about-skills" className="text-2xl md:text-3xl font-semibold text-slate-900">Skill Map</h2>
              <p className="mt-1 text-sm text-slate-500">Core capabilities in production</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {skills.map((group, idx) => (
                <article key={idx} className={`${cardBase} p-6`} tabIndex={0}>
                  <h3 className="text-lg font-semibold text-slate-900">{group?.group || "--"}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2 text-sm text-slate-700">
                    {(group?.items ?? []).length ? (
                      group.items.map((skill, i) => (
                        <li key={i} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">{skill}</li>
                      ))
                    ) : (
                      <li className="text-slate-400">--</li>
                    )}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Project snapshots */}
        {projects.length > 0 && (
          <section aria-labelledby="about-projects" className="flex flex-col gap-4">
            <div>
              <h2 id="about-projects" className="text-2xl md:text-3xl font-semibold text-slate-900">Project Snapshots</h2>
              <p className="mt-1 text-sm text-slate-500">From problem framing to measurable results</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {projects.map((project, idx) => (
                <article key={idx} className={`${cardBase} flex flex-col gap-4 p-6`} tabIndex={0}>
                  <header>
                    <h3 className="text-xl font-semibold text-slate-900">{project?.title || "--"}</h3>
                  </header>
                  <div className="space-y-4 text-sm text-slate-700">
                    {project?.problem && (
                      <p><span className="font-semibold text-slate-800">Problem. </span>
                        <span className="line-clamp-3">{project.problem}</span>
                      </p>
                    )}
                    {(project?.actions ?? []).length > 0 && (
                      <div>
                        <p className="font-semibold text-slate-800">Actions</p>
                        <ul className="mt-1 list-disc space-y-1 pl-4">
                          {project.actions!.map((a, i) => (<li key={i} className="line-clamp-3">{a}</li>))}
                        </ul>
                      </div>
                    )}
                    {project?.result && (
                      <p><span className="font-semibold text-slate-800">Result. </span>
                        <span className="line-clamp-3">{project.result}</span>
                      </p>
                    )}
                    {(project?.metrics ?? []).length > 0 && (
                      <div>
                        <p className="font-semibold text-slate-800">Metrics</p>
                        <ul className="mt-1 list-disc space-y-1 pl-4">
                          {project.metrics!.map((m, i) => (<li key={i} className="line-clamp-1">{m}</li>))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {(project?.links ?? []).length > 0 && (
                    <footer className="mt-auto flex flex-wrap gap-2 text-sm">
                      {project.links!
                        .filter((l) => l?.label && l?.url)
                        .map((l, i) => (
                          <a
                            key={`${project.title}-link-${i}`}
                            href={l.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                          >
                            {l.label}
                            <span aria-hidden className="text-xs text-slate-400">-&gt;</span>
                          </a>
                        ))}
                    </footer>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Timeline */}
        {timeline.length > 0 && (
          <section aria-labelledby="about-timeline" className="flex flex-col gap-4">
            <div>
              <h2 id="about-timeline" className="text-2xl md:text-3xl font-semibold text-slate-900">Timeline</h2>
              <p className="mt-1 text-sm text-slate-500">Milestones that shaped scope and ownership</p>
            </div>
            <ol className="relative border-l border-slate-200 pl-6 text-sm text-slate-700" aria-label="Career timeline">
              {timeline.map((e, idx) => (
                <li key={idx} className="mb-6 ps-2">
                  <div className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border border-white bg-sky-500 shadow" />
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{e?.date || "--"}</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{e?.title || "--"}</p>
                  {e?.note && <p className="mt-1 text-slate-700 line-clamp-3">{e.note}</p>}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Now / Next */}
        {(safeNow.length > 0 || safeNext.length > 0) && (
          <section aria-labelledby="about-now-next" className="flex flex-col gap-4">
            <div>
              <h2 id="about-now-next" className="text-2xl md:text-3xl font-semibold text-slate-900">Now / Next</h2>
              <p className="mt-1 text-sm text-slate-500">What I’m iterating on now and what’s next</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[{ title: "Now", items: safeNow }, { title: "Next", items: safeNext }].map((col) => (
                <article key={col.title} className={`${cardBase} p-6`} tabIndex={0}>
                  <h3 className="text-lg font-semibold text-slate-900">{col.title}</h3>
                  {(col.items ?? []).length ? (
                    <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-slate-700">
                      {col.items.map((item, i) => (<li key={i} className="line-clamp-2">{item}</li>))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-slate-500">--</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        {filteredCTAs.length > 0 && (
          <section
            aria-labelledby="about-cta"
            className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm"
          >
            <div>
              <h2 id="about-cta" className="text-2xl md:text-3xl font-semibold text-slate-900">Let's Work Together</h2>
              <p className="mt-2 text-sm text-slate-700">
                Explore the links below or drop a message if you would like to collaborate.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {filteredCTAs.map((cta, idx) => (
                <CTAButton key={`${cta.label}-${idx}`} href={cta.href} label={cta.label} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}