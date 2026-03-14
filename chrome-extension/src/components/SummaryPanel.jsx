import React, { useState } from "react";
import styles from "../styles/SummaryPanel.module.css";

function renderSummary(text) {
  return text.split("\n").map((line, i) => {
    const headerMatch = line.match(/^\d+\.\s+\*\*(.+?)\*\*:?\s*(.*)/);
    if (headerMatch) {
      return (
        <div key={i} className={styles.section}>
          <span className={styles.label}>{headerMatch[1]}</span>
          {headerMatch[2] && <span className={styles.value}>{headerMatch[2]}</span>}
        </div>
      );
    }
    if (line.includes("**")) {
      const parts = line.split(/\*\*(.+?)\*\*/g);
      return (
        <p key={i} className={styles.line}>
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
        </p>
      );
    }
    if (line.startsWith("- ") || line.startsWith("• ")) {
      return <li key={i} className={styles.bullet}>{line.slice(2)}</li>;
    }
    if (!line.trim()) return null;
    return <p key={i} className={styles.line}>{line}</p>;
  });
}

export function SummaryPanel({ summary, onStartChat }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>
          <span className={styles.icon}>✦</span> AI Summary
        </div>
        <div className={styles.actions}>
          <button className={styles.collapseBtn} onClick={() => setCollapsed(v => !v)}>
            {collapsed ? "expand" : "collapse"}
          </button>
          {onStartChat && (
            <button className={styles.chatBtn} onClick={onStartChat}>Chat →</button>
          )}
        </div>
      </div>
      {!collapsed && (
        <div className={styles.content}>{renderSummary(summary)}</div>
      )}
    </div>
  );
}
