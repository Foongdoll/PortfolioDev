import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CareerTimeline from "../components/common/careerTimeline/CareerTimeline";
import ProjectSlider from "../components/common/projectslider/ProjectSlider";

export default function Home() {
    // 타이핑 애니메이션 상태
    const [logo, setLogo] = useState<string>("");
    const [mainTxt, setMainTxt] = useState<string>("");
    const [subTxt, setSubTxt] = useState<string[]>([]);

    // 관찰할 섹션 id 배열 (hero 포함)
    const sectionIds = useMemo(() => ["top", "more", "experience", "techlog"], []);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 각 섹션 DOM 참조(옵저버 등록 시 사용)
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    useEffect(() => {
        let mounted = true;
        const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

        (async () => {
            // 1) logo
            const logoTxt = "SH.dev";
            for (let i = 1; i <= logoTxt.length && mounted; i++) {
                setLogo(logoTxt.slice(0, i));
                await sleep(80);
            }
            await sleep(200);

            // 2) main
            const mainText = "Create. Build. Deploy.";
            for (let i = 1; i <= mainText.length && mounted; i++) {
                setMainTxt(mainText.slice(0, i));
                await sleep(50);
            }
            await sleep(300);

            // 3) sub
            const segments = [
                "사용자와 팀이 체감할 수 있는 가치를 만드는 개발자, ",
                "신현우",
                "입니다.",
            ];
            const acc = ["", "", ""];
            for (let s = 0; s < segments.length && mounted; s++) {
                for (let i = 1; i <= segments[s].length && mounted; i++) {
                    acc[s] = segments[s].slice(0, i);
                    setSubTxt([acc[0], acc[1], acc[2]]);
                    await sleep(45);
                }
                await sleep(150);
            }
        })();

        // 처음 로드 시 최상단으로
        document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });

        return () => {
            mounted = false;
            setSubTxt([]);
            setLogo("");
            setMainTxt("");
        };
    }, []);

    // IntersectionObserver로 현재 보이는 섹션 감지 → currentIndex 동기화
    useEffect(() => {
        const thresholds = Array.from({ length: 21 }, (_, i) => i / 20); // 0~1 step 0.05
        const observer = new IntersectionObserver((entries) => {
            const best = entries
                .filter((e) => e.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (!best) return;
            const id = best.target.getAttribute("id");
            if (!id) return;
            const idx = sectionIds.indexOf(id);
            if (idx !== -1) setCurrentIndex(idx);
        }, { threshold: thresholds });

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [sectionIds]);

    // Next 버튼: 현재 index 기준 다음 섹션으로 스냅 이동
    const goNext = useCallback(() => {
        const ids = sectionIds; // ["top","more","experience","techlog"]
        const sections = ids
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => !!el);

        const viewportTop = window.scrollY;
        const epsilon = 8; // 살짝 여유

        // 현재 스크롤 기준으로 "아래에 있는" 첫 섹션을 찾음
        const next = sections.find((el) => {
            const top = el.offsetTop;
            return top > viewportTop + epsilon;
        });

        // 없으면 첫 섹션(루프 느낌)
        const target = next ?? sections[0];
        target.scrollIntoView({ behavior: "smooth" });
    }, [sectionIds]);

    return (
        <div className="w-full min-h-screen snap-y snap-mandatory scroll-smooth">
            {/* HERO */}
            <div
                id="top"
                className="relative h-screen w-full bg-[url('/bg.gif')] bg-no-repeat bg-center bg-cover snap-start"
            >
                {/* 상단 로고 */}
                <section className="absolute top-10 left-12">
                    <div className="flex items-center gap-2">
                        <span className="text-sky-400 text-3xl font-black">&lt;/&gt;</span>
                        <h1 className="font-semibold tracking-tight text-white">{logo}</h1>
                    </div>
                </section>

                {/* 중앙 텍스트 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                    <h2 className="text-7xl font-bold mb-4">{mainTxt}</h2>
                    <p className="text-2xl text-white/80 font-semibold max-w-xl">
                        {subTxt[0]} <span className="text-3xl text-white">{subTxt[1]}</span>
                        {subTxt[2]}
                    </p>
                </div>

                {/* 아래로 스크롤 버튼 */}
                <button
                    onClick={goNext}
                    className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50
             rounded-full px-5 py-2 text-sm bg-white/15 text-white
             backdrop-blur border border-white/20 transition-all
             hover:bg-white/25
             mb-[env(safe-area-inset-bottom)]"
                    aria-label="다음 섹션으로 이동"
                >
                    ↓ Next
                </button>
            </div>

            {/* 아래 콘텐츠 */}
            <section className="w-full text-slate-100 bg-slate-950">
                <div
                    id="more"
                    className="flex flex-col justify-center items-center min-h-screen px-6 text-center snap-start"
                >
                    <CareerTimeline />
                </div>

                <div
                    id="experience"
                    className="flex flex-col justify-center items-center min-h-screen px-6 snap-start"
                >
                    <ProjectSlider />
                </div>

                <div
                    id="techlog"
                    className="flex flex-col justify-center items-center min-h-screen px-6 text-center snap-start"
                >
                    <div className="max-w-3xl">
                        <h3 className="text-5xl font-bold mb-6">What I'm Learning</h3>
                        <ul className="list-disc list-inside text-slate-300 text-lg space-y-3">
                            <li>React Query 캐싱 전략 고도화</li>
                            <li>NestJS 모듈화 & 테스트</li>
                            <li>AWS 배포 자동화/모니터링</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
