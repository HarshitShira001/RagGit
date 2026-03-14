import React, { useState } from "react";
import styles from "../styles/ChatMessage.module.css";

function CodeBlock({ code, lang }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span className={styles.codeLang}>{lang || "code"}</span>
        <button className={styles.copyBtn} onClick={handleCopy}>{copied ? "✓ copied" : "copy"}</button>
      </div>
      <pre className={styles.pre}><code>{code}</code></pre>
    </div>
  );
}

function renderContent(content) {
  const parts = content.split(/(```[\s\S]*?```|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const inner = part.slice(3, -3);
      const nl = inner.indexOf("\n");
      const lang = nl > -1 ? inner.slice(0, nl).trim() : "";
      const code = nl > -1 ? inner.slice(nl + 1) : inner;
      return <CodeBlock key={i} code={code} lang={lang} />;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className={styles.inlineCode}>{part.slice(1, -1)}</code>;
    }
    return part.split("\n").map((line, j) => (
      <React.Fragment key={`${i}-${j}`}>{j > 0 && <br />}{line}</React.Fragment>
    ));
  });
}

function SourcesToggle({ sources }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.sources}>
      <button className={styles.sourcesToggle} onClick={() => setOpen(v => !v)}>
        {open ? "▾" : "▸"} {sources.length} source chunk{sources.length > 1 ? "s" : ""}
      </button>
      {open && (
        <div className={styles.sourcesList}>
          {sources.map((src, i) => <pre key={i} className={styles.sourceChunk}>{src}</pre>)}
        </div>
      )}
    </div>
  );
}

export function ChatMessage({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`${styles.wrapper} ${isUser ? styles.userWrapper : styles.assistantWrapper}`}>
      <div className={styles.avatar}>{isUser ? "You" : "AI"}</div>
      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.assistantBubble}`}>
        <div className={styles.content}>
          {isUser ? message.content : renderContent(message.content)}
        </div>
        {!isUser && message.sources?.length > 0 && <SourcesToggle sources={message.sources} />}
      </div>
    </div>
  );
}
