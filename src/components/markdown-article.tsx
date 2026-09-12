import { slugify } from "@/content/posts";

export function MarkdownArticle({ source }: { source: string }) {
  const lines = source.split("\n");
  const elements: React.ReactNode[] = [];
  let list: string[] = [];
  const flushList = (key: number) => { if (list.length) { elements.push(<ul key={`list-${key}`}>{list.map((item) => <li key={item}>{item}</li>)}</ul>); list = []; } };

  lines.forEach((line, index) => {
    if (line.startsWith("- ")) { list.push(line.slice(2)); return; }
    flushList(index);
    if (!line.trim()) return;
    if (line.startsWith("## ")) { const text = line.slice(3); elements.push(<h2 id={slugify(text)} key={index}>{text}</h2>); return; }
    if (line.startsWith("> ")) { elements.push(<blockquote key={index}>{line.slice(2)}</blockquote>); return; }
    elements.push(<p key={index}>{line}</p>);
  });
  flushList(lines.length);
  return <div className="article-prose">{elements}</div>;
}
