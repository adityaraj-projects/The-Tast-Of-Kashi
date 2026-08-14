import { useState } from "react";
import { useGetAiSuggestions, useSendAiMessage } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Sparkles, Send, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AiAssistantWidget() {
  const { data: suggestions, isLoading: suggestionsLoading } = useGetAiSuggestions();
  const [input, setInput] = useState("");
  const { mutate: sendMessage, isPending } = useSendAiMessage();

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    sendMessage({ data: { message: text } });
    setInput("");
    // Handle UI update locally if needed
  };

  return (
    <div className="bg-card border border-primary/30 p-5 rounded-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
      
      {/* Header */}
      <div className="relative flex items-center gap-3 mb-5">
        <div className="relative">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center border border-primary/40 relative z-10">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          {/* Glowing orb effect */}
          <div className="absolute inset-0 bg-primary/50 blur-xl rounded-full animate-pulse" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
            Kashi AI Guide
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </h3>
          <p className="text-xs text-muted-foreground">Your spiritual & cultural companion</p>
        </div>
      </div>

      {/* Suggestions */}
      <div className="relative space-y-2 mb-5">
        {suggestionsLoading ? (
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {suggestions?.slice(0, 3).map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSend(suggestion.text)}
                className="text-xs px-3 py-1.5 bg-black/40 border border-white/10 hover:border-primary/50 hover:text-primary rounded-full transition-colors text-muted-foreground whitespace-nowrap"
              >
                {suggestion.text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="relative flex gap-2">
        <Input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          placeholder="Ask about Kashi..." 
          className="bg-black/40 border-white/10 text-sm focus-visible:ring-primary/50"
          disabled={isPending}
        />
        <button 
          onClick={() => handleSend(input)}
          disabled={!input.trim() || isPending}
          className="w-10 h-10 flex-shrink-0 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}