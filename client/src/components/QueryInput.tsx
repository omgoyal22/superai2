import React, { useState, useEffect } from "react";
import { Search, Mic, MicOff } from "lucide-react";

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export function QueryInput({ onSubmit, isLoading }: QueryInputProps) {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about your data..."
          className="w-full px-4 py-3 pr-24 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          {recognition && (
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2 rounded-full transition-colors ${
                isListening
                  ? "text-red-500 hover:text-red-400 bg-red-500/10"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
      {isListening && (
        <div className="mt-2 text-sm text-blue-400 animate-pulse">
          Listening... Speak now
        </div>
      )}
    </form>
  );
}
