import type { Components } from "react-markdown"
import ReactMarkdown from "react-markdown"

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-foreground mt-6 mb-3 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold text-foreground mt-5 mb-2 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-foreground mt-4 mb-2 first:mt-0">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-sm leading-relaxed text-foreground/80 mb-3">
      {children}
    </p>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary-300 bg-primary-50/50 pl-4 py-2 my-3 text-sm text-foreground/70">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-5 mb-3 space-y-1 text-sm text-foreground/80">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 mb-3 space-y-1 text-sm text-foreground/80">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground bg-yellow-100 px-0.5 rounded-sm">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-foreground/70">{children}</em>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary-600 underline hover:text-primary-800 transition-colors"
    >
      {children}
    </a>
  ),
}

export default function MarkdownRenderer({ children }: { children: string }) {
  return (
    <div className="max-w-none">
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </div>
  )
}
