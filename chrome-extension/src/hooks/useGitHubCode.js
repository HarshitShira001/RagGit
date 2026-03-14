import { useState, useCallback } from "react";

export function useGitHubCode() {
  const [code, setCode]         = useState(null);
  const [filename, setFilename] = useState(null);
  const [language, setLanguage] = useState(null);
  const [url, setUrl]           = useState(null);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const fetchCode = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) throw new Error("No active tab found.");

      const response = await chrome.tabs.sendMessage(tab.id, { type: "GET_CODE" });

      if (!response?.success) throw new Error(response?.error || "Failed to extract code.");

      setCode(response.code);
      setFilename(response.filename);
      setLanguage(response.language);
      setUrl(response.url);
    } catch (err) {
      if (err.message?.includes("Could not establish connection")) {
        setError("Could not connect to the page. Please navigate to a GitHub file and refresh the tab, then try again.");
      } else {
        setError(err.message || "Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { code, filename, language, url, error, loading, fetchCode };
}
