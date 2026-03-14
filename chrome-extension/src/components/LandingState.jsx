import React from "react";
import styles from "../styles/LandingState.module.css";

export function LandingState({ onFetch, loading, error }) {
  return (
    <div className={styles.container}>
      <div className={styles.graphic}>
        <div className={styles.orb} />
        <div className={styles.orbRing} />
        <span className={styles.orbIcon}>⬡</span>
      </div>

      <h2 className={styles.heading}>Analyze Any GitHub File</h2>
      <p className={styles.subtext}>
        Open a file on GitHub, then click below to chat with the code using AI.
      </p>

      {error && (
        <div className={styles.errorBox}>
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      <button className={styles.fetchBtn} onClick={onFetch} disabled={loading}>
        {loading
          ? <><span className={styles.spinner} /> Detecting file…</>
          : <><span>◎</span> Scan Current File</>
        }
      </button>

      <div className={styles.steps}>
        {[
          ["1", "Open any GitHub file"],
          ["→", null],
          ["2", "Click Scan Current File"],
          ["→", null],
          ["3", "Ask anything about it"],
        ].map(([num, label], i) =>
          label ? (
            <div key={i} className={styles.step}>
              <span className={styles.stepNum}>{num}</span>
              <span>{label}</span>
            </div>
          ) : (
            <span key={i} className={styles.arrow}>→</span>
          )
        )}
      </div>
    </div>
  );
}
