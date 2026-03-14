import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/ChatInput.module.css";


export function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 120) + "px"; }
  }, [value]);

  const handleSubmit = () => {
    const t = value.trim();
    if (!t || disabled) return;
    onSend(t);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputRow}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about this file…"
          disabled={disabled}
          rows={1}
        />
        <button className={`${styles.sendBtn} ${(!value.trim() || disabled) ? styles.inactive : ""}`}
          onClick={handleSubmit} disabled={disabled || !value.trim()}>
          {disabled
            ? <span className={styles.spinner} />
            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
          }
        </button>
      </div>
      <p className={styles.hint}>Enter to send · Shift+Enter for newline</p>
    </div>
  );
}
