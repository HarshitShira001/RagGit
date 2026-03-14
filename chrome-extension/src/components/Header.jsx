import React from "react";
import styles from "../styles/Header.module.css";

const FILE_ICONS = {
  py:"🐍", js:"🟨", jsx:"⚛️", ts:"🔷", tsx:"⚛️", java:"☕",
  go:"🐹", rs:"🦀", cpp:"⚙️", c:"⚙️", cs:"🎯", rb:"💎",
  php:"🐘", swift:"🍎", kt:"🟪", md:"📝", json:"📋",
  yaml:"📄", yml:"📄", html:"🌐", css:"🎨", sql:"🗄️", sh:"💻",
};

function getIcon(filename) {
  if (!filename) return "📄";
  const ext = filename.split(".").pop()?.toLowerCase();
  return FILE_ICONS[ext] || "📄";
}

export function Header({ filename, language, lineCount, onReset }) {
  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.logo}>⬡</span>
          <span className={styles.title}>Rag <span className={styles.accent}>Git</span></span>
        </div>
        {filename && (
          <button className={styles.resetBtn} onClick={onReset} title="Scan a new file">
            ← new file
          </button>
        )}
      </div>

      {filename && (
        <div className={styles.fileMeta}>
          <div className={styles.fileChip}>
            <span className={styles.fileIcon}>{getIcon(filename)}</span>
            <span className={styles.fileName}>{filename}</span>
          </div>
          <div className={styles.badges}>
            {language && <span className={styles.badge}>{language}</span>}
            {lineCount && <span className={styles.badgeGray}>{lineCount} lines</span>}
          </div>
        </div>
      )}
    </header>
  );
}
