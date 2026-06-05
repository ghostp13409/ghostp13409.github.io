import React, { useState } from "react";
import { Send } from "lucide-react";

const AIIntegrationCard = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const MODEL_CONFIG = {
    url: "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
    headers: {
      "Content-Type": "application/json",
      //Authorization: "Bearer hf DeQtoJZpBrYmFsQvzZjpAJ eFFac WmBrPlR",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
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

      const botMessage = {
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
      className="w-full max-w-2xl mx-auto bg-gray-900/95 backdrop-blur-lg rounded-2xl 
      shadow-2xl shadow-blue-500/10 border border-gray-800 overflow-hidden"
    >
      <div className="flex flex-col h-[600px]">
        {/* Chat header */}
        <div className="p-4 border-b border-gray-800 bg-gray-800/50">
          <h2 className="text-xl font-bold text-blue-400">AI Chat Demo</h2>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-xl ${
                  message.role === "user"
                    ? "bg-blue-600/20 text-blue-100 rounded-br-sm"
                    : "bg-gray-800/50 text-gray-300 rounded-bl-sm"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800/50 text-gray-300 p-3 rounded-xl rounded-bl-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-gray-800 bg-gray-800/50"
        >
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-900/90 text-gray-100 rounded-xl px-4 py-2 
                focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600/20 text-blue-400 p-2 rounded-xl hover:bg-blue-600/30 
                transition-colors disabled:opacity-50"
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
