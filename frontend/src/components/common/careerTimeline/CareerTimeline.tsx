export default function CareerTimeline() {
  return (
    <section
      id="career"
      className="w-full snap-start flex items-center justify-center bg-transparent px-4 sm:px-6 lg:px-8 py-16 pb-28 text-slate-800"
      aria-labelledby="career-title"
    >
      <div className="mx-auto w-full max-w-screen-lg lg:max-w-screen-xl">
        <h3 id="career-title" className="text-4xl sm:text-5xl font-bold mb-10 text-center">
          Career Timeline
        </h3>

        <div className="relative mx-auto">
          {/* 중심 라인 (연한 그레이) */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-slate-200 z-0" />

          <ul className="space-y-8 sm:space-y-10 lg:space-y-12">
            {/* --- 각 TimelineCard는 그대로, 스타일만 라이트톤으로 --- */}
            <TimelineCard
              side="left"
              period="2022.09"
              title="국비 교육 (자바 풀스택 900h)"
              subtitle="개발 시작"
              body={
                <>
                  <p className="text-left text-sm sm:text-base text-slate-600">
                    자바/스프링 기반 백엔드와 기본 프런트엔드 역량을 체계적으로 학습.
                  </p>
                  <ul className="mt-2 text-left list-disc list-outside pl-6 text-sm text-slate-500 space-y-3">
                    <li>
                      <ProjectCard
                        period="2022.09 ~ 2022.11"
                        name="JSP 기반 전시·경매 웹"
                        participants="1인 (풀스택)"
                        summary="JSP/Servlet으로 전시·경매 관리 기능을 구현한 학습 프로젝트"
                        stacks="JSP, Servlet, MySQL"
                        githubUrl="https://github.com/Foongdoll/JSP-Project"
                        serviceUrl="http://49.142.157.251:9090/green2209J_10/artMain.art"
                      />
                    </li>
                    <li>
                      <ProjectCard
                        period="2023.02 ~ 2023.03"
                        name="Spring 기반 영화 예매 웹"
                        participants="1인 (풀스택)"
                        summary="CGV 유사 예매/조회 기능, 세션 및 CRUD 연습"
                        stacks="Spring, JSP, MySQL"
                        githubUrl="https://github.com/Foongdoll/Spring-Project"
                        serviceUrl="http://49.142.157.251:9090/green2209S_10/"
                      />
                    </li>
                  </ul>
                </>
              }
            />

            {/* 이하 기존 데이터 유지, 톤만 밝게 */}
            <TimelineCard
              side="right"
              period="2023.05"
              title="이노베이션티(주)"
              subtitle="(백엔드 중심 풀스택)"
              body={
                <>
                  <p className="text-left text-sm sm:text-base text-slate-600">
                    공공/민간 SI 프로젝트에서 요구분석~배포/운영까지 전 과정 경험.
                  </p>
                  <ul className="mt-2 text-left list-disc list-outside pl-6 text-sm text-slate-500 space-y-3">
                    <li>
                      <ProjectCard
                        period="2023.07 ~ 2024.01"
                        name="선문대학교 학사정보 리뉴얼"
                        participants="2인 (풀스택)"
                        summary="VB → C# 포팅, 공통 모듈 재설계 및 성능 개선"
                        stacks="C#, .NET, MS-SQL, IIS"
                        githubUrl=""
                        serviceUrl="https://sws.sunmoon.ac.kr/Login.aspx"
                      />
                    </li>
                    <li>
                      <ProjectCard
                        period="2023.09 ~ 2023.11"
                        name="인천 서구청 계약정보 시스템 고도화"
                        participants="1인 (풀스택)"
                        summary="Spring Legacy 기반 기능 보강 및 유지보수"
                        stacks="Java, Spring, JSP, Oracle, Linux"
                        githubUrl="https://github.com/Foongdoll/inno_seogu (보안상 소스는 private 입니다.)"
                        serviceUrl="https://gyeyak.seo.incheon.kr/contract/"
                      />
                    </li>
                    <li>
                      <ProjectCard
                        period="2024.02 ~ 2024.08"
                        name="FillMe - 손톱을 이용한 건강관리 영양제 추천 어플리케이션 개발"
                        participants="4인 (백엔드, 앱/관리자 프론트 풀스택 개발)"
                        summary="JWT/OAuth 인증, 사용자 데이터 처리 최적화, 앱 개발 (스토어 배포중)"
                        stacks="Spring Boot, MySQL, REST API, JWT/OAuth, React Native, React"
                        githubUrl=""
                        serviceUrl="https://www.fillme.co.kr/"
                      />
                    </li>
                    <li>
                      <ProjectCard
                        period="2024.07 ~ 2024.10"
                        name="인사동 한복착장 사이니지 시스템 개발"
                        participants="1인 (풀스택)"
                        summary="요구사항 수집 및 전체 설계 · 다국어 지원 모듈 · 자막 제어"
                        stacks="C#, Unity, MySQL, Figma"
                        githubUrl=""
                        serviceUrl="https://www.sentv.co.kr/article/view/sentv202502210054"
                      />
                    </li>
                  </ul>
                </>
              }
            />

            <TimelineCard
              side="left"
              period="2024.12"
              title="울림(주)"
              subtitle="재직중 (풀스택)"
              badge="현재"
              body={
                <>
                  <p className="text-sm sm:text-base text-slate-600">
                    공공기관 시스템 고도화/유지보수, 대용량 문서·이중망 환경 대응.
                  </p>
                  <ul className="mt-2 text-left list-disc list-outside pl-6 text-sm text-slate-500 space-y-3">
                    <li>
                      <ProjectCard
                        period="2024.12 ~ 2025.06"
                        name="동물용 의약품 관리 시스템 고도화"
                        participants="5인 (풀스택)"
                        summary="Nexacro + Spring Boot 기반 기능 고도화 및 운영"
                        stacks="Nexacro, Spring Boot"
                        githubUrl=""
                        serviceUrl="https://medi.qia.go.kr/index"
                      />
                    </li>
                    <li>
                      <ProjectCard
                        period="2025.01 ~ 2025.05"
                        name="eCTD 4.0 시스템 고도화"
                        participants="3인 (풀스택)"
                        summary="문서 검증/버전관리 자동화, 무중단 전환"
                        stacks="Spring Boot, XML"
                        githubUrl=""
                        serviceUrl=""
                      />
                    </li>
                    <li>
                      <ProjectCard
                        period="2025.01 ~ 현재"
                        name="식약처 연구관리시스템 유지보수"
                        participants="2인 (풀스택)"
                        summary="요구사항 반영, 서버 인프라 관리"
                        stacks="JSP, Java, Spring, Oracle"
                        githubUrl=""
                        serviceUrl="https://rnd.mfds.go.kr/welcome"
                      />
                    </li>
                  </ul>
                </>
              }
            />
          </ul>
        </div>
      </div>
    </section>
  );
}

/* 내부 카드 – 라이트 톤 */
function TimelineCard({
  side = "left",
  period,
  title,
  subtitle,
  body,
  badge,
}: {
  side?: "left" | "right";
  period: string;
  title: string;
  subtitle?: string;
  body?: React.ReactNode;
  badge?: string;
}) {
  const isLeft = side === "left";
  return (
    <li className={`relative z-10 flex ${isLeft ? "justify-start md:justify-end" : "justify-start md:justify-start"}`}>
      {/* 포인트 점 (하늘색) */}
      <div className="absolute left-3 md:left-1/2 md:-translate-x-1/2 top-5 h-3 w-3 rounded-full bg-sky-500 shadow z-10" />
      <div className={`w-full md:w-[calc(50%-3.5rem)] xl:w-[calc(50%-5rem)] ${isLeft ? "md:pr-10 xl:pr-14" : "md:pl-10 xl:pl-14"}`}>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:p-7 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] sm:text-xs text-slate-600">
                {period}
              </span>
              <h4 className="text-base sm:text-lg font-semibold">
                {title} {subtitle && <span className="text-slate-500">· {subtitle}</span>}
              </h4>
            </div>
            {badge && (
              <span className="text-[10px] rounded-full border border-sky-300 bg-sky-50 px-2 py-0.5 text-sky-600">
                {badge}
              </span>
            )}
          </div>
          {body && <div className="mt-3">{body}</div>}
        </article>
      </div>
    </li>
  );
}

function ProjectCard({
  period,
  name,
  participants,
  summary,
  stacks,
  githubUrl,
  serviceUrl,
}: {
  period: string;
  name: string;
  participants?: string;
  summary?: string;
  stacks?: string;
  githubUrl?: string;
  serviceUrl?: string;
}) {
  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] text-slate-600">
          {period}
        </span>
        <h5 className="text-sm sm:text-base font-semibold text-slate-800">{name}</h5>
      </div>

      <div className="mt-2 space-y-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
        {participants && (
          <p>
            <span className="font-medium text-slate-700">참가자:</span> {participants}
          </p>
        )}
        {summary && (
          <p>
            <span className="font-medium text-slate-700">개요:</span> {summary}
          </p>
        )}
        {stacks && (
          <p>
            <span className="font-medium text-slate-700">스택:</span> {stacks}
          </p>
        )}
        {(githubUrl || serviceUrl) && (
          <p className="space-x-3">
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noreferrer" className="underline decoration-sky-400/60 text-sky-700 hover:text-sky-600">
                Github
              </a>
            )}
            {serviceUrl && (
              <a href={serviceUrl} target="_blank" rel="noreferrer" className="underline decoration-sky-400/60 text-sky-700 hover:text-sky-600">
                Service
              </a>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
