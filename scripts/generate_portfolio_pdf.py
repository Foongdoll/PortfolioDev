#!/usr/bin/env python3
"""Generate a concise PDF portfolio for SH.dev based on repository data."""

from __future__ import annotations

import os
import textwrap
from typing import Iterable, List


class SimplePDFBuilder:
    """Very small PDF writer that supports multi-line text pages."""

    def __init__(self, page_width: int = 595, page_height: int = 842, margin: int = 56):
        self.page_width = page_width
        self.page_height = page_height
        self.margin = margin
        self._objects: List[str] = []
        self._pages: List[int] = []
        self._font_obj = self._add_object(
            "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
        )

    def _add_object(self, body: str) -> int:
        self._objects.append(body)
        return len(self._objects)

    @staticmethod
    def _escape_text(text: str) -> str:
        return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")

    def add_page(self, lines: Iterable[str]) -> None:
        usable_height = self.page_height - 2 * self.margin
        line_height = 14
        max_lines = max(1, usable_height // line_height)
        line_list = list(lines)
        if len(line_list) > max_lines:
            raise ValueError(
                f"Page has {len(line_list)} lines but only {max_lines} fit in the page bounds"
            )

        start_y = self.page_height - self.margin - 24
        cursor_y = start_y
        leading = 14
        content_lines = ["BT", f"/F1 11 Tf", f"{leading} TL", f"1 0 0 1 {self.margin} {cursor_y} Tm"]

        for line in line_list:
            escaped = self._escape_text(line)
            content_lines.append(f"({escaped}) Tj")
            content_lines.append("T*")

        content_lines.append("ET")
        content_stream = "\n".join(content_lines)
        content_bytes = content_stream.encode("latin-1")
        content_obj = self._add_object(
            f"<< /Length {len(content_bytes)} >>\nstream\n{content_stream}\nendstream"
        )

        page_obj = self._add_object(
            "<< /Type /Page /Parent __PARENT__ 0 R /MediaBox [0 0 {w} {h}] "
            "/Contents {content} 0 R /Resources << /Font << /F1 {font} 0 R >> >> >>".format(
                w=self.page_width,
                h=self.page_height,
                content=content_obj,
                font=self._font_obj,
            )
        )
        self._pages.append(page_obj)

    def save(self, path: str) -> None:
        if not self._pages:
            raise RuntimeError("No pages to render")

        kids = " ".join(f"{p} 0 R" for p in self._pages)
        pages_obj = self._add_object(
            f"<< /Type /Pages /Kids [{kids}] /Count {len(self._pages)} >>"
        )
        catalog_obj = self._add_object(f"<< /Type /Catalog /Pages {pages_obj} 0 R >>")

        # Inject the actual parent reference into each page definition.
        parent_ref = str(pages_obj)
        self._objects = [obj.replace("__PARENT__", parent_ref) for obj in self._objects]

        with open(path, "wb") as fh:
            fh.write(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
            offsets = [0]
            for idx, body in enumerate(self._objects, start=1):
                offsets.append(fh.tell())
                fh.write(f"{idx} 0 obj\n".encode("latin-1"))
                fh.write(body.encode("latin-1"))
                fh.write(b"\nendobj\n")

            xref_pos = fh.tell()
            count = len(self._objects)
            fh.write(f"xref\n0 {count + 1}\n".encode("latin-1"))
            fh.write(b"0000000000 65535 f \n")
            for offset in offsets[1:]:
                fh.write(f"{offset:010d} 00000 n \n".encode("latin-1"))
            fh.write(b"trailer\n")
            fh.write(
                f"<< /Size {count + 1} /Root {catalog_obj} 0 R >>\n".encode("latin-1")
            )
            fh.write(b"startxref\n")
            fh.write(f"{xref_pos}\n".encode("latin-1"))
            fh.write(b"%%EOF")


def wrap_paragraph(text: str, width: int = 86) -> List[str]:
    if not text:
        return [""]
    return textwrap.wrap(text, width=width)


def wrap_bullet(text: str, width: int = 86, indent: int = 4, bullet: str = "- ") -> List[str]:
    wrapped = textwrap.wrap(
        text,
        width=max(1, width - indent),
        initial_indent="" if not text else "",
        subsequent_indent="",
    )
    if not wrapped:
        return [" " * indent + bullet.strip()]
    lines: List[str] = []
    prefix = " " * indent + bullet
    lines.append(prefix + wrapped[0])
    follow_indent = " " * (indent + len(bullet))
    for segment in wrapped[1:]:
        lines.append(follow_indent + segment)
    return lines


def build_lines() -> List[str]:
    lines: List[str] = []

    def add_blank():
        lines.append("")

    def add_heading(title: str) -> None:
        lines.append(title)
        lines.append("-" * min(len(title), 86))

    def add_paragraph(text: str) -> None:
        for segment in wrap_paragraph(text):
            lines.append(segment)

    def add_bullets(items: Iterable[str], indent: int = 4) -> None:
        for item in items:
            for segment in wrap_bullet(item, indent=indent):
                lines.append(segment)

    lines.append("SH.dev Portfolio Snapshot")
    lines.append("==========================")
    add_paragraph(
        "Tagline (translated): Full-stack developer who delivers tangible value for users and teams."  # noqa: E501
    )
    add_paragraph(
        "Hero message: Create. Build. Deploy. The site introduces SH.dev as developer Shin Hyunwoo."  # noqa: E501
    )
    add_paragraph(
        "Learning focus highlights: React Query caching strategies, NestJS modular testing, and AWS deployment automation."  # noqa: E501
    )
    add_blank()

    add_heading("Guiding Values")
    add_bullets(
        [
            "Analyze problems structurally and pursue root causes.",
            "Form hypotheses with data and validate them rigorously.",
            "Simplify cross-team communication and build trust through documentation.",
            "Treat readable, maintainable code as the greatest productivity lever.",
            "Prioritize observability in every system.",
            "Aim for user experiences that stay simple yet powerful.",
        ]
    )
    add_blank()

    add_heading("Impact Metrics")
    add_bullets(
        [
            "API P95 latency reduced from 900ms to 280ms for the FillMe service.",
            "Crash-free mobile sessions improved from 96% to 99.2% on FillMe.",
            "Deployment lead time cut by 70% through the DevOps-Hub pipeline.",
            "SSH/SFTP error rate lowered by 90% via DevOps-Hub enhancements.",
            "Signage playback failure rate reduced from 3.1% to 0.6% for the Insadong tourism system.",
        ]
    )
    add_blank()

    add_heading("Core Skills")
    add_paragraph("Frontend: React, Vite, Tailwind CSS, Zustand, TanStack Query, TypeScript.")
    add_paragraph("Backend: Spring Boot, NestJS, MySQL, Redis, JPA, JWT, REST API design.")
    add_paragraph("Mobile & Desktop: React Native, Electron, Expo.")
    add_paragraph("DevOps: Docker, GitHub Actions, AWS EC2 and S3, Nginx, Terraform, PM2.")
    add_paragraph("Additional: CI/CD practices, OAuth2, Clean Architecture, Git, Progressive Web Apps, Accessibility.")
    add_blank()

    add_heading("Current Focus and Next Steps")
    add_paragraph("Now: Optimizing Electron plus React desktop apps, advancing AI summarization and Q&A, refining Flowin planner UI and performance.")
    add_paragraph("Next: Adding LLM-based personal assistant features, modularizing CI/CD workflows, and fully automating AWS infrastructure with Terraform.")
    add_blank()

    add_heading("Professional Timeline")
    add_paragraph("2022.09 - Began development journey through a 900-hour Java full-stack bootcamp covering Java, Spring, and foundational frontend skills.")
    add_bullets(
        [
            "Solo JSP exhibition and auction web project: implemented exhibition and auction management (JSP, Servlet, MySQL).",
            "Solo Spring-based movie ticketing web project: CGV-style booking and CRUD exercises (Spring, JSP, MySQL).",
        ],
        indent=6,
    )
    add_blank()
    add_paragraph("2023.05 - Joined InnovationT as a back-end focused full-stack developer handling public and private SI projects end-to-end.")
    add_bullets(
        [
            "Sunmoon University academic information renewal: ported VB to C#, redesigned shared modules, and improved performance (C#, .NET, MS-SQL, IIS).",
            "Incheon Seo-gu contract information upgrade: enhanced Spring Legacy features and maintenance (Java, Spring, JSP, Oracle, Linux).",
            "FillMe health supplement recommendation app: delivered JWT/OAuth auth, optimized user data flows, and shipped React Native + admin web apps (Spring Boot, MySQL, JWT/OAuth, React Native, React).",
            "Insadong Hanbok signage system: gathered requirements, designed system end-to-end, added multilingual support and subtitle controls (C#, Unity, MySQL, Figma).",
        ],
        indent=6,
    )
    add_blank()
    add_paragraph("2024.12 - Joined ULLIM as a full-stack engineer for public sector systems modernization and maintenance in high-volume, dual-network environments.")
    add_bullets(
        [
            "Animal drug management system upgrade: Nexacro plus Spring Boot enhancements and operations support.",
            "eCTD 4.0 system upgrade: automated document validation and version management with zero-downtime transitions (Spring Boot, XML).",
            "MFDS research management maintenance: handled requirements and server infrastructure (JSP, Java, Spring, Oracle).",
        ],
        indent=6,
    )
    add_blank()

    add_heading("Flagship Deliverables")
    add_paragraph("FillMe - AI-driven health recommendation app tackling API latency and session drops.")
    add_bullets(
        [
            "Redesigned auth with JWT plus OAuth2 and stabilized sessions.",
            "Accelerated MySQL queries with indexing to trim recommendation latency by 69%.",
            "Introduced GitHub Actions to EC2 automated deployments and refined recommendation logic using user behavior logs.",
            "Results: crash-free sessions at 99.2%, P95 latency cut from 900ms to 280ms, seven-day retention up 18%.",
        ],
        indent=6,
    )
    add_blank()
    add_paragraph("DevOps-Hub - Consolidated Git, SSH, and SFTP workspace reducing terminal juggling.")
    add_bullets(
        [
            "Built SSH2 real-time terminal with SFTP tree UI and automated Git workflows (commit, push, stage).",
            "Unified Electron and NestJS environment with Docker plus GitHub Actions CI/CD.",
            "Results: deployment lead time down 70%, SSH/SFTP errors down 90%, session switching 2.5x faster.",
        ],
        indent=6,
    )
    add_blank()
    add_paragraph("Insadong Hanbok signage system - Stabilized multimedia signage and localization.")
    add_bullets(
        [
            "Designed offline content cache and playback scheduler to reduce network dependence.",
            "Implemented Korean, English, Chinese, and Japanese subtitle modules with Oracle tourism API integration.",
            "Results: playback complaints down 70%, international visitor usage up 30%, rollout time shortened by 60%.",
        ],
        indent=6,
    )
    add_blank()

    add_heading("Side Projects Snapshot")
    add_paragraph("Note - Electron productivity suite (Jun-Jul 2025, active).")
    add_bullets(
        [
            "Electron plus React offline workspace merging markdown notes, flashcards, and scheduling with dual-panel editing and autosave.",
            "Flashcard folders with instant edit, study, and flip transitions, plus PDF/CSV/XLS export from calendar views.",
            "Legacy JSON storage migrated into split metadata and body files, normalizing image paths and cleaning unused assets.",
        ],
        indent=6,
    )
    add_blank()
    add_paragraph("Flowin Ledger - Desktop finance manager for KRW and USD freelancers (Sep-Oct 2025, active).")
    add_bullets(
        [
            "Electron local storage keeping entries.jsonl and fxrates.json atomic for offline security.",
            "Three-pane view for transactions, currency exchange, and asset holdings with modal-driven workflows and Chart.js analytics.",
            "Auto converts USD trades to KRW via a rate resolver, highlights missing FX data, and unifies exchange plus holdings CRUD flows.",
        ],
        indent=6,
    )
    add_blank()
    add_paragraph("Dailyon - AI productivity companion PWA (since Aug 2024, active).")
    add_bullets(
        [
            "Hybrid local 3B and cloud 7B models orchestrated for real-time note summaries and tag recommendations.",
            "Drag-and-drop board with JSON-defined category fields, optimistic layout sync, and dnd-kit powered reordering.",
            "JWT refresh automation with Axios interceptors plus modular Spring Boot and WebSocket pipelines for live scheduling and chat.",
        ],
        indent=6,
    )
    add_blank()

    add_heading("Key Links")
    add_bullets(
        [
            "GitHub: https://github.com/Foongdoll",
            "Portfolio: https://foongdoll.dev",
            "Blog: https://dailyon.vercel.app",
            "Resume download path: /resume.pdf",
        ]
    )

    return lines


def paginate_lines(lines: List[str], max_lines: int = 42) -> List[List[str]]:
    pages: List[List[str]] = []
    current: List[str] = []
    for line in lines:
        if len(current) >= max_lines:
            pages.append(current)
            current = []
        current.append(line)
    if current:
        pages.append(current)
    return pages


def main() -> None:
    lines = build_lines()
    pages = paginate_lines(lines)
    builder = SimplePDFBuilder()
    for page in pages:
        builder.add_page(page)
    output_path = os.path.join(os.path.dirname(__file__), "..", "portfolio.pdf")
    builder.save(os.path.abspath(output_path))
    print(f"Generated {os.path.abspath(output_path)} with {len(pages)} page(s).")


if __name__ == "__main__":
    main()
