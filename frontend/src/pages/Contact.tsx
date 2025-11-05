import { Github, Mail, MessageCircle, FileText } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

type ContactCard = {
  id: string;
  title: string;
  summary: string;
  icon: React.ComponentType<{ className?: string }>;
  action:
    | { type: "link"; label: string; href: string }
    | { type: "hint"; label: string };
};

const GITHUB_PROFILE = "https://github.com/Foongdoll";
const RESUME_URL = "/resume.pdf";

export default function Contact() {
  const email = import.meta.env.VITE_CONTACT_EMAIL?.trim();
  const messenger = import.meta.env.VITE_CONTACT_CHAT?.trim();
  const nav = useNavigate();

  const contactCards = useMemo<ContactCard[]>(() => {
    const cards: ContactCard[] = [
      {
        id: "resume",
        title: "이력서 다운로드",
        summary:
          "최신 경력과 프로젝트 요약을 PDF로 열람할 수 있습니다. 사전 공유용으로 최적화된 파일입니다.",
        icon: FileText,
        action: {
          type: "link",
          label: "resume.pdf 열기",
          href: RESUME_URL,
        },
      },
      {
        id: "github",
        title: "GitHub",
        summary:
          "업데이트되는 소스 코드와 사이드 프로젝트 기록을 확인할 수 있습니다.",
        icon: Github,
        action: {
          type: "link",
          label: GITHUB_PROFILE.replace("https://", ""),
          href: GITHUB_PROFILE,
        },
      },
    ];

    if (email) {
      cards.unshift({
        id: "mail",
        title: "이메일",
        summary:
          "빠른 피드백이 필요한 제안이나 협업 문의는 이메일로 연락 주세요.",
        icon: Mail,
        action: {
          type: "link",
          label: email,
          href: `mailto:${email}`,
        },
      });
    } else {
      cards.unshift({
        id: "mail-missing",
        title: "이메일",
        summary:
          "이메일 주소가 설정되지 않았습니다. 배포 환경 변수 VITE_CONTACT_EMAIL을 지정하면 자동으로 노출됩니다.",
        icon: Mail,
        action: {
          type: "hint",
          label: "VITE_CONTACT_EMAIL을 설정하세요",
        },
      });
    }

    cards.push(
      messenger
        ? {
            id: "chat",
            title: "메신저",
            summary:
              "실시간 커뮤니케이션이 필요한 경우 등록된 메신저 채널로 연결됩니다.",
            icon: MessageCircle,
            action: {
              type: "link",
              label: messenger.replace(/^https?:\/\//, ""),
              href: messenger.startsWith("http") ? messenger : `https://${messenger}`,
            },
          }
        : {
            id: "chat-placeholder",
            title: "기타 채널",
            summary:
              "Slack, Discord, KakaoTalk 등 즐겨 쓰는 채널이 있다면 VITE_CONTACT_CHAT 환경 변수로 등록해 두세요.",
            icon: MessageCircle,
            action: {
              type: "hint",
              label: "VITE_CONTACT_CHAT을 설정하세요",
            },
          }
    );

    return cards;
  }, [email, messenger]);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-24 text-white">
      <section className="w-full max-w-4xl space-y-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
          Contact
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          협업과 커뮤니케이션을 빠르게 연결합니다
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
          SH.dev 포트폴리오는 사용자 경험과 서비스 안정화를 중시합니다. 프로젝트
          제안, 기술 검토 요청, 커리어 상담 등 언제든지 편한 채널로 연락 주세요.
        </p>
        <button
          type="button"
          onClick={() => nav("/projects")}
          className="inline-flex items-center justify-center rounded-full border border-sky-400/60 bg-sky-400/10 px-5 py-2 text-sm font-medium text-sky-200 transition hover:bg-sky-400/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        >
          대표 프로젝트 먼저 보기
        </button>
      </section>

      <section
        aria-labelledby="contact-channel-heading"
        className="mt-16 grid w-full max-w-5xl gap-6 sm:grid-cols-2"
      >
        <h2 id="contact-channel-heading" className="sr-only">
          연락 채널
        </h2>
        {contactCards.map(({ id, title, summary, icon: Icon, action }) => (
          <article
            key={id}
            className="flex h-full flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/10"
          >
            <div className="flex items-center gap-4">
              <span className="rounded-2xl bg-sky-500/20 p-3 text-sky-200">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
            </div>
            <p className="flex-1 text-sm leading-6 text-slate-200">{summary}</p>
            {action.type === "link" ? (
              <a
                className="inline-flex items-center gap-2 self-start rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                href={action.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                {action.label}
              </a>
            ) : (
              <p className="text-xs font-medium text-amber-200">
                {action.label}
              </p>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
