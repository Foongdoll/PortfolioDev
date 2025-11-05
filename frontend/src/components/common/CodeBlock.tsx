import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

export type CodeBlockProps = {
  language: string;
  code: string;
};

export default function CodeBlock({ language, code }: CodeBlockProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-1 shadow-inner">
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        showLineNumbers
        wrapLongLines
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: "1rem",
          background: "transparent",
          fontSize: "0.85rem",
          lineHeight: 1.6,
          padding: "1.25rem",
        }}
        codeTagProps={{
          style: {
            fontFamily:
              "SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

