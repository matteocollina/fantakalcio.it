import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
};

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="pt-4 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="pt-6 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="pt-4 text-xl font-semibold tracking-tight text-[var(--text-secondary)]">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="pt-3 text-lg font-semibold tracking-tight text-[var(--text-tertiary)]">
            {children}
          </h4>
        ),
        p: ({ children }) => <p className="text-lg leading-8 text-[var(--text-secondary)]">{children}</p>,
        ul: ({ children }) => (
          <ul className="list-disc space-y-3 pl-6 text-lg leading-8 text-[var(--text-secondary)]">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal space-y-3 pl-6 text-lg leading-8 text-[var(--text-secondary)]">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="pl-1">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-[var(--border-strong)] pl-5 italic text-[var(--text-tertiary)]">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="border-[var(--border)]" />,
        a: ({ href, children }) => {
          if (!href) {
            return <span>{children}</span>;
          }

          const className =
            "underline decoration-[var(--text-muted)] underline-offset-4 transition-colors hover:text-[var(--text-primary)] hover:decoration-[var(--text-primary)]";

          if (href.startsWith("/")) {
            return (
              <Link href={href} className={className}>
                {children}
              </Link>
            );
          }

          return (
            <a
              href={href}
              className={className}
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          );
        },
        code: ({ children, className }) => {
          if (className) {
            return <code className={className}>{children}</code>;
          }

          return (
            <code className="rounded bg-[var(--code-bg)] px-1.5 py-0.5 text-[0.95em] text-[var(--code-fg)]">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-sm leading-7 text-[var(--text-secondary)]">
            {children}
          </pre>
        ),
        strong: ({ children }) => <strong className="font-semibold text-[var(--text-primary)]">{children}</strong>,
        em: ({ children }) => <em className="italic text-[var(--text-secondary)]">{children}</em>,
        table: ({ children }) => (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-base text-[var(--text-secondary)]">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => <thead className="border-b border-[var(--border-strong)]">{children}</thead>,
        tbody: ({ children }) => <tbody className="divide-y divide-[var(--border)]">{children}</tbody>,
        th: ({ children }) => (
          <th className="px-3 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            {children}
          </th>
        ),
        td: ({ children }) => <td className="px-3 py-3 align-top text-[var(--text-secondary)]">{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
