import { useEffect, useRef, useState } from "react";

/** ----- 데이터 타입 (모든 키가 화면에 노출될 수 있도록 유지) ----- */
type Project = {
  title: string;
  period?: string;
  role?: string;
  teamSize?: string;
  stacks?: string;
  problem?: string;
  actions?: string[];
  impact?: string;
  metrics?: string[];
  githubUrl?: string;
  serviceUrl?: string;
  screenshots: screenShot[];
  bg?: string;
  screenshotCaptions?: string[];
  companyOrClient?: string;
  domain?: string;
  scale?: string;
  summary?: string;
  ownership?: string;
};

type screenShot = {
  src: string;
  desc?: string;
}

export default function ProjectSlider() {
  const projects: Project[] = [
    {
      title: "FillMe - 건강관리 AI 추천 앱",
      period: "2024.02 ~ 2024.08",
      role: "풀스택 개발",
      teamSize: "4명 (풀스택:4)",
      stacks: "React Native, React, Spring Boot, MySQL, JWT·OAuth2, AWS",
      companyOrClient: "이노베이션티㈜ · 링커버스",
      domain: "헬스케어 / 추천 시스템",
      summary:
        "Spring Boot 기반 API·인증 구조와 추천 로직을 최적화해 Crash Free 99.2%, 응답속도 900→480 ms 달성",
      problem:
        "초기 버전에서 API 응답 지연과 인증 세션 만료 문제로 사용자 이탈이 발생했습니다.",
      actions: [
        "JWT + OAuth 기반 인증·세션 구조 재설계 및 토큰 로테이션 적용",
        "MySQL 인덱싱·쿼리 튜닝으로 추천 알고리즘 응답속도 69% 단축",
        "사용자 행동 로그 기반 추천 로직 개선으로 클릭률 상승",
      ],
      impact:
        "서비스 안정성과 사용 편의성 개선으로 사용자 체류시간 및 추천 전환율 상승",
      metrics: [
        "API P95 응답시간 900 ms → 280 ms (−69%)",
        "Crash-Free 세션율 96% → 99.2%",
        "앱 유지율 7일 기준 +18 %",
      ],
      ownership: "백엔드 ",
      githubUrl: "https://github.com/Foongdoll/FillMe",
      serviceUrl:
        "https://apps.apple.com/kr/app/fillme-1%EB%B6%84/id1640130403",
      screenshots: [{ src: "/fillme1.png", desc: "플레이스토어" }, { src: "/fillme2.png", desc: "소개사이트" }, { src: "/fillme3.png", desc: "앱스토어" }],
      bg: "from-sky-600/20 to-slate-800/30",
    },
    {
      title: "DevOps-Hub – Git/SSH/SFTP 통합 개발 플랫폼",
      period: "2025.06 ~ 2025.07",
      role: "단독 개발 (Full-Stack)",
      teamSize: "1명",
      stacks:
        "React (Vite, Zustand, React-Query), NestJS, MySQL, Electron, Docker",
      companyOrClient: "개인 프로젝트",
      domain: "SSH, SFTP 간편 사용 / 형상관리 자동화",
      summary:
        "Git·SSH·SFTP 기능을 통합한 MobaXterm-스타일 툴로 개발 효율성 ↑ 70 %",
      problem:
        "다수의 터미널/FTP 툴을 병행해야 하는 비효율로 배포·형상 관리에 시간이 낭비되었습니다.",
      actions: [
        "SSH2 기반 실시간 터미널·SFTP 파일 트리 구성",
        "Git 모듈(Commit/Push/History/Stage Toggle 등) UI 자동화",
        "Electron + NestJS API 통합으로 데스크톱 단일 환경 제공",
      ],
      impact: "개발자 1인당 배포·형상 작업시간 평균 40 분 → 12 분 단축",
      metrics: ["배포 리드타임 –70 %", "SSH/SFTP 접속 오류율 –90 %", "프로젝트 세션 전환 속도 2.5× 개선"],
      ownership: "기획-설계-프론트-백엔드-빌드 전 과정 단독",
      githubUrl: "https://github.com/Foongdoll/DevOps-Hub",
      serviceUrl: "http://13.124.87.223/portfolio",
      screenshots: [
        { src: "/devops1.png", desc: "메인" },
        { src: "/devops2.png", desc: "" },
        { src: "/devops3.png", desc: "SSH에서 조회한 폴더 구조로 생성한 트리" },
        { src: "/devops4.png", desc: "커밋기록조회" },
        { src: "/devops5.png", desc: "변경파일조회 및 제어" },
        { src: "/devops6.png", desc: "커밋한 파일 변경 코드 조회" },
      ],
      bg: "from-indigo-500/20 to-slate-800/30",
    },
    {
      title: "인사동 한복착장 사이니지 시스템",
      period: "2024.07 ~ 2024.10",
      role: "백엔드 개발",
      teamSize: "2명 (풀스택:1 / 디자이너:1)",
      stacks: "Unity, C#, MySQL",
      companyOrClient: "이노베이션티㈜ · 위트글로벌(주)",
      domain: "스마트 사이니지 / 관광 인프라",
      summary: "다국어·실시간 콘텐츠 캐시 구조로 피크시간 재생 실패율 3.1 % → 0.6 %",
      problem:
        "현장 네트워크 불안정으로 영상 지연·중단이 잦고, 콘텐츠 스케줄 관리가 수동으로 운영되었습니다.",
      actions: [
        "콘텐츠 캐시 및 재생 스케줄러 설계로 네트워크 의존도 최소화",
        "다국어(한·영·중·일) 자막 모듈 설계 및 구현",
        "Oracle 제공 관광 API 연동",
        "메뉴의 각 이벤트별 영상,자막 싱크 제어",
      ],
      impact:
        "메뉴 간 이미지 렌더링 속도 향상 및 동영상 끊김 현상 감소 ",
      metrics: ["재생 실패율 3.1 % → 0.6 %", "콘텐츠 롤아웃 시간 –60 %"],
      ownership: "프론트엔드,백엔드 100 %, 스케줄링 로직·캐시 정책 설계 리드",
      githubUrl: "",
      serviceUrl: "https://www.sentv.co.kr/article/view/sentv202502210054",
      screenshots: [
        { src: "/signage1.png", desc: "" },
        { src: "/signage2.png", desc: "" }
      ],
      bg: "from-pink-500/20 to-slate-800/30",
    },
    {
      title: "식약처 - 연구관리시스템 유지보수",
      period: "2024.12 ~ ",
      role: "풀스택",
      teamSize: "2명 (풀스택)",
      stacks: "Spring, JSP, Oracle, Jeus",
      companyOrClient: "울림㈜ · 식품의약품안전처",
      domain: "의약품 과제, 연구 관리",
      summary: "완전 유지보수로 프론트,백엔드 서버 배포 권한 관리",
      problem:
        "정책 변경으로 인한 비효율적 SQL 처리 속도",
      actions: [
        "SQL 튜닝 및 더미 데이터 삭제로 조회 속도 향상 평균 3s -> 2s",
        "정적 파일 정리 및 처리 로직 최적화로 Chrome LightHouse 성능 42점 -> 51점 향상"
      ],
      impact:
        "각 메뉴 별 조회 및 문서 다운로드 속도 향상",
      metrics: ["대용량 과제 조회 속도 향상", "민원 감소"],
      ownership: "프론트엔드,백엔드 100 %, 스케줄링 로직·캐시 정책 설계 리드",
      githubUrl: "",
      serviceUrl: "https://rnd.mfds.go.kr/welcome",
      screenshots: [
        { src: "/mfds1.png", desc: "" },
      ],
      bg: "from-red-500/20 to-slate-300/30",
    },
  ];

  const arrowButtonBase =
    "absolute top-1/2 -translate-y-1/2 text-3xl sm:text-4xl px-3 py-2 rounded-full bg-white/80 text-slate-700 shadow-lg backdrop-blur-sm transition-all duration-150 hover:bg-white hover:text-black hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-0 z-20 border border-white/70";

  /** ----- 바깥(프로젝트) 슬라이더 상태 ----- */
  const [projIdx, setProjIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const projTotal = projects.length;

  useEffect(() => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translateX(-${projIdx * 100}%)`;
  }, [projIdx]);

  // 바깥 슬라이더 터치 스와이프
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let startX = 0;
    const onStart = (e: TouchEvent) => (startX = e.touches[0].clientX);
    const onEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) setProjIdx((p) => (p + 1) % projTotal);
      else if (endX - startX > 50) setProjIdx((p) => (p - 1 + projTotal) % projTotal);
    };
    el.addEventListener("touchstart", onStart);
    el.addEventListener("touchend", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [projTotal]);

  /** ----- 안쪽(스크린샷) 슬라이더 상태 ----- */
  const [shotIdx, setShotIdx] = useState<number[]>(() => projects.map(() => 0));
  const shotRefs = useRef<Array<HTMLDivElement | null>>([]);

  const goShot = (iProj: number, dir: 1 | -1) => {
    const total = projects[iProj].screenshots?.length ?? 0;
    if (total <= 0) return;
    setShotIdx((arr) => {
      const next = [...arr];
      next[iProj] = (next[iProj] + dir + total) % total;
      return next;
    });
  };

  useEffect(() => {
    projects.forEach((p, i) => {
      const ref = shotRefs.current[i];
      if (!ref) return;
      const total = p.screenshots?.length ?? 0;
      const percent = total > 0 ? (shotIdx[i] * 100) : 0;
      ref.style.transform = `translateX(-${percent}%)`;
    });
  }, [shotIdx, projects]);

  return (
    <div className="max-w-[80%] w-full text-center h-[86vh] relative text-slate-800">
      <h3 className="text-4xl sm:text-5xl font-bold mb-6">
        Featured Projects <span className="ml-2 text-sky-500 align-middle">&lt;/&gt;</span>
      </h3>

      {/* 바깥 래퍼(프로젝트 단위) */}
      <div className="relative w-full h-[calc(100%_-_3.5rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* 바깥 트랙 — 각 프로젝트가 100% 폭을 차지하도록 수정 */}
        <div
          ref={trackRef}
          className="flex h-full transition-transform duration-700 ease-in-out will-change-transform"
          style={{ width: `${projTotal * (100 / projTotal)}.1%` }}
        >
          {projects.map((p, i) => {
            const bg = p.bg ?? "from-slate-50 to-white";
            const shots = p.screenshots ?? [];
            const captions = p.screenshotCaptions ?? [];

            return (
              <section key={p.title} className="basis-full shrink-0 h-full relative">
                {/* 파스텔 배경 */}
                <div className={`absolute inset-0 z-0 bg-gradient-to-br ${bg}`} />

                {/* 내용: 좌(설명)/우(이미지) */}
                <div className="relative z-10 grid h-full grid-cols-1 lg:grid-cols-12 gap-6 p-6 lg:p-10">
                  {/* ---- 좌: 정보 카드 ---- */}
                  <article className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 text-left overflow-y-auto shadow-sm">
                    <h4 className="text-2xl sm:text-3xl font-bold text-slate-900">{p.title}</h4>

                    {/* 프로젝트 메타: 존재여부와 관계없이 기본값이라도 노출 */}
                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] sm:text-sm text-slate-700">
                      <div><span className="text-slate-500">기간</span> : {p.period || "—"}</div>
                      <div><span className="text-slate-500">역할</span> : {p.role || "—"}</div>
                      <div><span className="text-slate-500">팀 규모</span> : {p.teamSize || "—"}</div>
                      <div><span className="text-slate-500">도메인</span> : {p.domain || "—"}</div>
                      <div className="col-span-2"><span className="text-slate-500">스택</span> : {p.stacks || "—"}</div>
                      <div className="col-span-2"><span className="text-slate-500">소속/고객</span> : {p.companyOrClient || "—"}</div>
                      <div className="col-span-2"><span className="text-slate-500">규모</span> : {p.scale || "—"}</div>
                      <div className="col-span-2"><span className="text-slate-500">소유/기여</span> : {p.ownership || "—"}</div>
                    </div>

                    {/* Summary */}
                    <div className="mt-4">
                      <h5 className="text-slate-800 font-semibold text-sm">요약(Summary)</h5>
                      <p className="text-slate-700 text-sm mt-1 leading-relaxed">
                        {p.summary || "설명 준비 중입니다."}
                      </p>
                    </div>

                    {/* Problem */}
                    <div className="mt-4">
                      <h5 className="text-slate-800 font-semibold text-sm">문제(Problem)</h5>
                      <p className="text-slate-700 text-sm mt-1 leading-relaxed">
                        {p.problem || "설명 준비 중입니다."}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-4">
                      <h5 className="text-slate-800 font-semibold text-sm">핵심 행동(Actions)</h5>
                      {Array.isArray(p.actions) && p.actions.length > 0 ? (
                        <ul className="mt-2 list-disc list-outside pl-5 text-slate-700 text-sm space-y-1">
                          {p.actions.map((a, idx) => (
                            <li key={idx}>{a}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-500 text-sm mt-1">내용 준비 중</p>
                      )}
                    </div>

                    {/* Results */}
                    <div className="mt-4">
                      <h5 className="text-slate-800 font-semibold text-sm">성과(Results)</h5>
                      <p className="text-slate-700 text-sm mt-1">{p.impact || "—"}</p>
                      {Array.isArray(p.metrics) && p.metrics.length > 0 ? (
                        <ul className="mt-2 list-disc list-outside pl-5 text-slate-700 text-sm space-y-1">
                          {p.metrics.map((m, idx) => (
                            <li key={idx}>{m}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                    {/* Links */}
                    <div className="mt-4 flex gap-4 text-sm">
                      <a
                        href={p.githubUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className={`underline decoration-sky-400/60 ${p.githubUrl ? "text-sky-700 hover:text-sky-600" : "text-slate-300 pointer-events-none"}`}
                      >
                        GitHub
                      </a>
                      <a
                        href={p.serviceUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className={`underline decoration-sky-400/60 ${p.serviceUrl ? "text-sky-700 hover:text-sky-600" : "text-slate-300 pointer-events-none"}`}
                      >
                        Service
                      </a>
                    </div>
                  </article>

                  {/* ---- 우: 스크린샷 캐러셀 ---- */}
                  <aside className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-4 flex flex-col shadow-sm">
                    {/* 뷰포트 */}
                    <div className="relative w-full aspect-[16/9] min-h-[420px] overflow-hidden rounded-xl bg-white">
                      {/* 트랙 — width를 shots.length * 100% 로 고정, translate는 비율로 */}
                      <div
                        ref={(el) => {
                          shotRefs.current[i] = el;
                        }}
                        className="flex h-full w-full transition-transform duration-500 ease-out will-change-transform"
                        style={{ width: `100%` }}
                      >
                        {shots && shots.length > 0 ? (
                          shots.map((item, idx) => (<>                            
                            <div
                              key={`${p.title}-${idx}`}
                              className="basis-full shrink-0 h-full w-full flex items-center justify-center bg-white"
                            >
                              <img
                                src={item.src || "/no_image.png"}
                                alt="project screenshot"
                                className="block max-h-full max-w-full object-contain"
                                loading="lazy"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = "/no_image.png";
                                }}
                              />
                            </div>
                          </>
                          ))
                        ) : (
                          <div className="basis-full shrink-0 h-full w-full flex items-center justify-center text-slate-400 text-sm">
                            스크린샷 없음
                          </div>
                        )}
                      </div>

                      {/* 내부 화살표 */}
                      {(shots?.length || 0) > 1 && (
                        <>
                          <button
                            onClick={() => goShot(i, -1)}
                            className={`${arrowButtonBase} left-3 sm:left-4`}
                            aria-label="이전 이미지"
                          >
                            ‹
                          </button>
                          <button
                            onClick={() => goShot(i, +1)}
                            className={`${arrowButtonBase} right-3 sm:right-4`}
                            aria-label="다음 이미지"
                          >
                            ›
                          </button>
                          {/* 도트 */}
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                            {shots.map((_, idx) => (
                              <span
                                key={idx}
                                className={`h-1.5 w-1.5 rounded-full ${shotIdx[i] === idx ? "bg-slate-700" : "bg-slate-300"
                                  }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* 스크린샷 캡션 */}
                    <div className="mt-3 text-xs sm:text-[13px] text-slate-600 text-left">
                      {(captions.length > 0 && captions[shotIdx[i]]) ||
                        ((shots?.length || 0) > 1 ? "스크린샷을 좌/우로 넘겨 보세요." : "")}
                    </div>
                  </aside>
                </div>
              </section>
            );
          })}
        </div>

        {/* 바깥 프로젝트 내비 */}
        <button
          onClick={() => setProjIdx((p) => (p - 1 + projTotal) % projTotal)}
          className={`${arrowButtonBase} left-3 sm:left-4`}
          aria-label="이전 프로젝트"
        >
          ‹
        </button>
        <button
          onClick={() => setProjIdx((p) => (p + 1) % projTotal)}
          className={`${arrowButtonBase} right-3 sm:right-4`}
          aria-label="다음 프로젝트"
        >
          ›
        </button>

        {/* 바깥 도트 인디케이터 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {projects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setProjIdx(idx)}
              className={`h-2 w-2 rounded-full ${projIdx === idx ? "bg-slate-700" : "bg-slate-300"}`}
              aria-label={`프로젝트 ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
