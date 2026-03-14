import { useState, useCallback } from "react";
import { chatWithCode } from "../services/api.service";

export function useChat({ code, filename, language }) {
  const [messages, setMessages]   = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);

  const sendMessage = useCallback(async (question) => {
    if (!question.trim() || !code) return;

    const userMessage = { role: "user", content: question };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));

    try {
      const result = await chatWithCode({ question, code, filename, language, chatHistory });
      setMessages(prev => [...prev, { role: "assistant", content: result.answer, sources: result.sources || [] }]);
    } catch (err) {
      setError(err.message || "Failed to get a response. Is the backend running on port 8000?");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [code, filename, language, messages]);

  const clearChat = useCallback(() => { setMessages([]); setError(null); }, []);

  return { messages, isLoading, error, sendMessage, clearChat };
}
