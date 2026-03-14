import React, { useState, useEffect, useRef } from "react";
import { Header }       from "./components/Header";
import { LandingState } from "./components/LandingState";
import { SummaryPanel } from "./components/SummaryPanel";
import { ChatMessage }  from "./components/ChatMessage";
import { ChatInput }    from "./components/ChatInput";
import { useGitHubCode } from "./hooks/useGitHubCode";
import { useChat }       from "./hooks/useChat";
import { analyzeCode, checkHealth } from "./services/api.service";
import styles from "./styles/App.module.css";

export default function App() {
  const [view, setView]           = useState("landing");
  const [summary, setSummary]     = useState(null);
  const [lineCount, setLineCount] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeErr, setAnalyzeErr] = useState(null);
  const [backendOk, setBackendOk] = useState(null);
  const bottomRef = useRef(null);

  const { code, filename, language, error: codeError, loading: codeLoading, fetchCode } = useGitHubCode();
  const { messages, isLoading: chatLoading, error: chatError, sendMessage, clearChat } = useChat({ code, filename, language });

  // Health check on mount
  useEffect(() => {
    checkHealth().then(() => setBackendOk(true)).catch(() => setBackendOk(false));
  }, []);

  // Auto-analyze when code is fetched
  useEffect(() => {
    if (!code || !filename) return;
    (async () => {
      setAnalyzing(true);
      setAnalyzeErr(null);
      try {
        const result = await analyzeCode({ code, filename, language });
        setSummary(result.summary);
        setLineCount(result.line_count);
        setView("summary");
      } catch (err) {
        setAnalyzeErr(err.message);
        setView("chat");
      } finally {
        setAnalyzing(false);
      }
    })();
  }, [code, filename, language]);

  // Auto-scroll chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  const handleFetch = async () => {
    setSummary(null); setLineCount(null); clearChat();
    await fetchCode();
  };

  const handleReset = () => {
    setView("landing"); setSummary(null); setLineCount(null); clearChat();
  };

  const activeError = codeError || analyzeErr;

  return (
    <div className={styles.app}>
      {backendOk === false && (
        <div className={styles.offlineBanner}>
          ⚠ Backend offline — run <code>uvicorn main:app --reload --port 8000</code> in the backend folder
        </div>
      )}

      <Header filename={filename} language={language} lineCount={lineCount} onReset={handleReset} />

      {analyzing && (
        <div className={styles.analyzingBar}>
          <span className={styles.pulse} /> Analyzing {filename} with AI…
        </div>
      )}

      <main className={styles.main}>
        {/* LANDING */}
        {view === "landing" && (
          <LandingState onFetch={handleFetch} loading={codeLoading || analyzing} error={activeError} />
        )}

        {/* SUMMARY */}
        {view === "summary" && summary && (
          <div className={styles.summaryView}>
            <SummaryPanel summary={summary} onStartChat={() => setView("chat")} />
          </div>
        )}

        {/* CHAT */}
        {view === "chat" && (
          <div className={styles.chatView}>
            {summary && <SummaryPanel summary={summary} onStartChat={null} />}

            <div className={styles.messages}>
              {messages.length === 0 && !chatLoading && (
                <div className={styles.welcome}>
                  <span className={styles.waveIcon}>👋</span>
                  <p>I've read <strong>{filename}</strong>. Ask me anything!</p>
                </div>
              )}

              {messages.map((msg, i) => <ChatMessage key={i} message={msg} />)}

              {chatLoading && (
                <div className={styles.thinking}>
                  <span className={styles.dot} /><span className={styles.dot} /><span className={styles.dot} />
                </div>
              )}

              {chatError && <div className={styles.chatError}>⚠ {chatError}</div>}
              <div ref={bottomRef} />
            </div>

            <ChatInput onSend={sendMessage} disabled={chatLoading} />

            <div className={styles.toolbar}>
              <button className={styles.toolBtn} onClick={clearChat}>clear chat</button>
              <button className={styles.toolBtn} onClick={handleReset}>← new file</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
