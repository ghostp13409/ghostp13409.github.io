import { useState } from "react";
import type { FC, FormEvent } from "react";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIIntegrationCard: FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const MODEL_CONFIG = {
    url: "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
    headers: {
      "Content-Type": "application/json",
      //Authorization: "Bearer hf DeQtoJZpBrYmFsQvzZjpAJ eFFac WmBrPlR",
    },
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(MODEL_CONFIG.url, {
        method: "POST",
        headers: MODEL_CONFIG.headers,
        body: JSON.stringify({
          inputs: input,
          options: {
            wait_for_model: true,
            use_cache: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let botResponse = "";

      if (Array.isArray(data)) {
        botResponse =
          data[0]?.generated_text || "I'm not sure how to respond to that.";
      } else if (data.generated_text) {
        botResponse = data.generated_text;
      } else {
        throw new Error("Unexpected response format");
      }

      const botMessage: Message = {
        role: "assistant",
        content: botResponse.trim(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting to the AI service. Please try again in a moment.",
        },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto bg-surface/60 backdrop-blur-xl rounded-lg 
      shadow-2xl border border-border overflow-hidden"
    >
      <div className="flex flex-col h-[600px]">
        {/* Chat header */}
        <div className="p-4 border-b border-border bg-surface/40">
          <h2 className="text-xl font-bold text-primary tracking-tight">AI Chat Demo</h2>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-md ${
                  message.role === "user"
                    ? "bg-primary/20 text-ink border border-primary/30"
                    : "bg-secondary/10 text-ink/80 border border-secondary/20"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary/10 text-ink/80 p-3 rounded-md border border-secondary/20">
                <div className="flex space-x-1.5 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.1, 0.8]
                      }}
                      transition={{ 
                        duration: 1, 
                        repeat: Infinity, 
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                      className="w-1.5 h-1.5 bg-secondary rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-border bg-surface/40"
        >
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-neutral-bg/60 text-ink rounded-md px-4 py-2 
                focus:outline-none focus:ring-1 focus:ring-primary/50 border border-border"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-neutral-bg p-2 rounded-md hover:bg-primary/80 
                transition-all duration-300 disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIIntegrationCard;
