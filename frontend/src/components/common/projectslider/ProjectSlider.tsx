import { useEffect, useMemo, useRef, useState } from "react";

/** ----- 데이터 타입 (키만 맞춰서 값 채워 넣으세요) ----- */
type Project = {
  title: string;
  period?: string;              // 예: "2023.08 ~ 2024.01"
  role?: string;                // 예: "백엔드 리드" / "풀스택"
  teamSize?: string;            // 예: "5명(백2/프2/디1)"
  stacks?: string;              // 예: "React, RN, Spring Boot, MySQL, AWS"
  problem?: string;             // 문제/배경
  actions?: string[];           // 핵심 행동(불릿)
  impact?: string;              // 제품/비즈니스 임팩트 한 문장
  metrics?: string[];           // 정량지표(불릿) 예: "응답시간 450ms→120ms(−73%)"
  githubUrl?: string;           // 깃허브 링크
  serviceUrl?: string;          // 서비스 링크
  screenshots: string[];        // 캡처 이미지 경로 배열
  bg?: string;                  // tailwind gradient stop (선택)
};

export default function ProjectSlider() {
  /** ----- 예시 데이터(키 구조만 참고). 값은 자유롭게 교체 ----- */
  const projects = useMemo<Project[]>(
    () => [
      {
        title: "FillMe - 손톱을 이용한 건강관리 영양제 추천 어플리케이션 개발",
        period: "2023.08 ~ 2024.01",
        role: "풀스택",
        teamSize: "4명(풀스택2/기획1/디자인1)",
        stacks: "React Native, Spring Boot, MySQL, JWT/OAuth, AWS",
        problem: "헬스케어 데이터 기반으로 개인 맞춤형 추천 정확도/성능/안정성 확보 필요",
        actions: [
          "인증·세션 설계(JWT/OAuth) 및 데이터 수집 파이프라인 구성",
          "추천 로직 API 최적화 및 쿼리 튜닝",
          "릴리즈 파이프라인 구성 및 크래시/로그 관측성 도입"
        ],
        impact: "앱 체류시간과 전환 이벤트가 의미 있게 개선됨",
        metrics: [
          "API P95 응답 900ms → 280ms",
          "Crash Free Sessions 96% → 99.2%"
        ],
        githubUrl: "",           // <- 채워 넣기
        serviceUrl: "",          // <- 채워 넣기
        screenshots: [
          "/images/fillme-1.png",
          "/images/fillme-2.png",
          "/images/fillme-3.png",
        ],
        bg: "from-sky-600/20 to-slate-800/30",
      },
      {
        title: "인사동 한복착장 사이니지 시스템 개발",
        period: "2024.02 ~ 2024.06",
        role: "백엔드",
        teamSize: "3명",
        stacks: "React, NestJS, MySQL, Redis",
        problem: "현장 재생/배포 안정성과 콘텐츠 스케줄 동기화 문제",
        actions: [
          "콘텐츠 스케줄러 + 캐시 설계로 플레이어 지연 최소화",
          "배포 파이프라인/롤백 정책 정립"
        ],
        impact: "이벤트 피크 시간대 재생 끊김/지연 민원 감소",
        metrics: ["플레이 실패율 3.1% → 0.6%", "배포 리드타임 60% 단축"],
        githubUrl: "",
        serviceUrl: "",
        screenshots: [
          "/images/signage-1.png",
          "/images/signage-2.png",
        ],
        bg: "from-pink-500/20 to-slate-800/30",
      },
      {
        title: "식약처 연구관리시스템 유지보수",
        period: "2025.01 ~ 현재",
        role: "백엔드",
        teamSize: "2명",
        stacks: "JSP, Java, Spring, Oracle",
        problem: "레거시 코드로 인한 장애 대응 및 성능 저하",
        actions: [
          "문제 쿼리 튜닝 및 배치 스케줄 정리",
          "로그 표준화/모니터링 대시보드 도입"
        ],
        impact: "야간 장애콜 감소 및 월간 처리량 안정화",
        metrics: ["월 장애콜 40% 감소", "배치 소요 35% 단축"],
        githubUrl: "",
        serviceUrl: "",
        screenshots: [
          "/images/mfds-1.png",
          "/images/mfds-2.png",
          "/images/mfds-3.png",
        ],
        bg: "from-emerald-500/20 to-slate-800/30",
      },
    ],
    []
  );

  /** ----- 바깥(프로젝트) 슬라이더 상태 ----- */
  const [projIdx, setProjIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const projTotal = projects.length;
  const step = 100 / projTotal;

  useEffect(() => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translateX(-${projIdx * step}%)`;
  }, [projIdx, step]);

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

  /** ----- 안쪽(스크린샷) 슬라이더 상태: 프로젝트별 인덱스 관리 ----- */
  const [shotIdx, setShotIdx] = useState<number[]>(
    () => projects.map(() => 0)
  );
  const shotRefs = useRef<Array<HTMLDivElement | null>>([]);

  const goShot = (iProj: number, dir: 1 | -1) => {
    const total = projects[iProj].screenshots.length;
    setShotIdx((arr) => {
      const next = [...arr];
      next[iProj] = (next[iProj] + dir + total) % total;
      return next;
    });
  };

  // 스크린샷 트랙 이동
  useEffect(() => {
    projects.forEach((p, i) => {
      const ref = shotRefs.current[i];
      if (!ref) return;            
      ref.style.transform = `translateX(-${shotIdx[i] * 33.3}%)`;
    });
  }, [shotIdx, projects]);

  return (
    <div className="max-w-7xl w-full text-center h-[86vh] relative">
      <h3 className="text-4xl sm:text-5xl font-bold mb-6">Featured Projects</h3>

      {/* 바깥 래퍼(프로젝트 단위) */}
      <div className="relative w-full h-[calc(100%_-_3.5rem)] overflow-hidden rounded-3xl border border-white/10">
        {/* 바깥 트랙 */}
        <div
          ref={trackRef}
          className="flex h-full transition-transform duration-700 ease-in-out will-change-transform"
          style={{ width: `${projTotal * 33.34}%` }}
        >
          {projects.map((p, i) => {
            const bg = p.bg ?? "from-slate-700/20 to-slate-900/40";
            const shots = p.screenshots ?? [];
            

            return (
              <section
                key={p.title}
                className="basis-full shrink-0 h-full relative"
              >
                {/* 배경 */}
                <div className={`absolute inset-0 z-0 bg-gradient-to-br ${bg}`} />

                {/* 내용: 좌(설명) / 우(이미지 캐러셀) */}
                <div className="relative z-10 grid h-full grid-cols-1 lg:grid-cols-2 gap-6 p-6 lg:p-10">
                  {/* ---- 좌: 합격률 올리는 정보 카드 ---- */}
                  <article className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 sm:p-6 text-left overflow-y-auto">
                    <h4 className="text-white text-2xl sm:text-3xl font-bold">
                      {p.title}
                    </h4>
                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] sm:text-sm text-slate-300">
                      {p.period && <div><span className="text-slate-400">기간</span> : {p.period}</div>}
                      {p.role && <div><span className="text-slate-400">역할</span> : {p.role}</div>}
                      {p.teamSize && <div><span className="text-slate-400">팀 규모</span> : {p.teamSize}</div>}
                      {p.stacks && <div className="col-span-2"><span className="text-slate-400">스택</span> : {p.stacks}</div>}
                    </div>

                    {/* Problem → Actions → Results(지표) */}
                    {p.problem && (
                      <div className="mt-4">
                        <h5 className="text-slate-200 font-semibold text-sm">문제(Problem)</h5>
                        <p className="text-slate-300 text-sm mt-1 leading-relaxed">{p.problem}</p>
                      </div>
                    )}

                    {p.actions?.length ? (
                      <div className="mt-4">
                        <h5 className="text-slate-200 font-semibold text-sm">핵심 행동(Actions)</h5>
                        <ul className="mt-2 list-disc list-outside pl-5 text-slate-300 text-sm space-y-1">
                          {p.actions.map((a) => <li key={a}>{a}</li>)}
                        </ul>
                      </div>
                    ) : null}

                    {(p.impact || p.metrics?.length) && (
                      <div className="mt-4">
                        <h5 className="text-slate-200 font-semibold text-sm">성과(Results)</h5>
                        {p.impact && <p className="text-slate-300 text-sm mt-1">{p.impact}</p>}
                        {p.metrics?.length ? (
                          <ul className="mt-2 list-disc list-outside pl-5 text-slate-300 text-sm space-y-1">
                            {p.metrics.map((m) => <li key={m}>{m}</li>)}
                          </ul>
                        ) : null}
                      </div>
                    )}

                    {(p.githubUrl || p.serviceUrl) && (
                      <div className="mt-4 flex gap-4 text-sm">
                        {p.githubUrl && (
                          <a href={p.githubUrl} target="_blank" rel="noreferrer"
                             className="underline decoration-sky-400/60 hover:text-sky-300">GitHub</a>
                        )}
                        {p.serviceUrl && (
                          <a href={p.serviceUrl} target="_blank" rel="noreferrer"
                             className="underline decoration-sky-400/60 hover:text-sky-300">Service</a>
                        )}
                      </div>
                    )}
                  </article>

                  {/* ---- 우: 스크린샷 캐러셀 ---- */}
                  <aside className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 flex flex-col">
                    {/* 뷰포트 */}
                    <div className="relative w-full flex-1 overflow-hidden rounded-xl">
                      {/* 트랙 */}
                      <div
                        ref={(el) => {(shotRefs.current[i] = el)}}
                        className="flex h-full transition-transform duration-500 ease-out will-change-transform"
                        style={{ width: `${shots.length * 100}%` }}
                      >
                        {shots.map((src) => (
                          <div key={src} className="basis-full shrink-0 h-full flex items-center justify-center bg-slate-900/20">
                            {/* 이미지: object-contain으로 안전 표시 */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={src}
                              alt="screenshot"
                              className="max-h-full max-w-full object-contain"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>

                      {/* 안쪽 내비 */}
                      {shots.length > 1 && (
                        <>
                          <button
                            onClick={() => goShot(i, -1)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-slate-300 hover:text-white transition z-20"
                            aria-label="이전 이미지"
                          >‹</button>
                          <button
                            onClick={() => goShot(i, +1)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl text-slate-300 hover:text-white transition z-20"
                            aria-label="다음 이미지"
                          >›</button>

                          {/* 도트 */}
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                            {shots.map((_, idx) => (
                              <span
                                key={idx}
                                className={`h-1.5 w-1.5 rounded-full ${shotIdx[i] === idx ? "bg-white" : "bg-white/40"}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* 캡션(선택) */}
                    <div className="mt-3 text-xs text-slate-400">
                      스크린샷을 좌/우로 넘겨 보세요.
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
          className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl text-slate-300 hover:text-white transition z-20"
          aria-label="이전 프로젝트"
        >‹</button>
        <button
          onClick={() => setProjIdx((p) => (p + 1) % projTotal)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl text-slate-300 hover:text-white transition z-20"
          aria-label="다음 프로젝트"
        >›</button>

        {/* 바깥 도트 인디케이터 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {projects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setProjIdx(idx)}
              className={`h-2 w-2 rounded-full ${projIdx === idx ? "bg-white" : "bg-white/40"}`}
              aria-label={`프로젝트 ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
