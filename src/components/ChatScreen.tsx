import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Send, Sparkles } from "lucide-react";
import { fetchChatHistory, sendChatMessage, type ChatMessage } from "../services/chatService";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isTyping?: boolean;
}

function TypingMessage({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 20);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <span className="text-[15px] leading-[20px]">{displayedText}</span>;
}

export function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchChatHistory();
        if (data.length === 0) {
          setMessages([
            {
              id: "welcome",
              text: "Вітаю! Я ваш помічник FOPilot 💙 Можу допомогти з питаннями про податки, звітність та ведення ФОП. Що вас цікавить?",
              sender: "bot",
              timestamp: new Date(),
            },
          ]);
          return;
        }

        const formatted: Message[] = data.map((msg: ChatMessage) => {
          const rawTs: any = msg.timestamp;
          let date: Date;
          if (typeof rawTs === "string") {
            date = new Date(rawTs);
          } else if (rawTs?._seconds) {
            date = new Date(rawTs._seconds * 1000);
          } else {
            date = new Date();
          }

          return {
            id: msg.id,
            sender: msg.sender,
            text: msg.text,
            timestamp: date,
          };
        });

        setMessages(formatted);
      } catch (error) {
        console.error(error);
        toast.error("Не вдалося завантажити історію чату");
        setMessages([
          {
            id: "welcome",
            text: "Вітаю! Я ваш помічник FOPilot 💙 Можу допомогти з питаннями про податки, звітність та ведення ФОП. Що вас цікавить?",
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const { reply } = await sendChatMessage(userMessage.text);
      setIsTyping(false);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: reply,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      toast.error("Не вдалося надіслати повідомлення");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages by time
  const shouldShowTimestamp = (currentMsg: Message, prevMsg?: Message) => {
    if (!prevMsg) return true;
    const timeDiff = currentMsg.timestamp.getTime() - prevMsg.timestamp.getTime();
    return timeDiff > 60000; // Show timestamp if more than 1 minute apart
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header - iMessage Style */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-4 py-3 shadow-sm">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="text-center">
            <h2 className="font-semibold">FOPilot AI</h2>
            <p className="text-xs text-green-600 dark:text-green-400">Online</p>
          </div>
        </div>
      </div>

      {/* Messages Area - iMessage Style */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto px-4 py-6 space-y-1"
        style={{ 
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {messages.map((message, index) => {
          const prevMessage = index > 0 ? messages[index - 1] : undefined;
          const showTimestamp = shouldShowTimestamp(message, prevMessage);
          const isConsecutive = prevMessage?.sender === message.sender && !showTimestamp;

          return (
            <div key={message.id}>
              {/* Timestamp */}
              {showTimestamp && (
                <div className="text-center my-4">
                  <span className="text-xs text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full bg-white/50 dark:bg-gray-800/50">
                    {message.timestamp.toLocaleTimeString("uk-UA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`flex items-end gap-2 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } ${isConsecutive ? "mt-0.5" : "mt-2"}`}
              >
                {/* Avatar for bot (only on last consecutive message) */}
                {message.sender === "bot" && !isConsecutive && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mb-0.5 shadow-sm flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                  </div>
                )}

                {/* Spacer for consecutive bot messages */}
                {message.sender === "bot" && isConsecutive && <div className="w-7 flex-shrink-0" />}

                {/* Bubble */}
                <div
                  className={`group relative max-w-[75%] sm:max-w-[60%] px-4 py-2.5 shadow-sm transition-all duration-200 ${
                    message.sender === "user"
                      ? "bg-[#007AFF] text-white rounded-[20px] rounded-br-[4px]"
                      : "bg-[#E9E9EB] dark:bg-[#3A3A3C] text-[#000000] dark:text-[#FFFFFF] rounded-[20px] rounded-bl-[4px]"
                  }`}
                  style={{
                    wordBreak: 'break-word',
                    boxShadow: message.sender === "user" 
                      ? "0 1px 2px rgba(0, 122, 255, 0.2)" 
                      : "0 1px 2px rgba(0, 0, 0, 0.1)"
                  }}
                >
                  {message.isTyping && message.sender === "bot" ? (
                    <TypingMessage text={message.text} />
                  ) : (
                    <span className="text-[15px] leading-[20px]">{message.text}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-end gap-2 justify-start mt-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mb-0.5 shadow-sm flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="px-4 py-3 bg-[#E9E9EB] dark:bg-[#3A3A3C] rounded-[20px] rounded-bl-[4px] shadow-sm">
              <div className="flex gap-1">
                <div 
                  className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" 
                  style={{ animationDelay: "0ms", animationDuration: "1s" }}
                ></div>
                <div 
                  className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" 
                  style={{ animationDelay: "200ms", animationDuration: "1s" }}
                ></div>
                <div 
                  className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" 
                  style={{ animationDelay: "400ms", animationDuration: "1s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Extra space at bottom */}
        <div className="h-4" />
      </div>

      {/* Input Area - iMessage Style */}
      <div className="flex-shrink-0 px-4 py-2.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          {/* Input Container */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="iMessage"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
              className="w-full px-4 py-2 pr-12 text-[15px] bg-white dark:bg-[#1C1C1E] border border-gray-300 dark:border-gray-700 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50 shadow-sm transition-all"
              style={{
                resize: 'none',
                minHeight: '36px',
                maxHeight: '120px'
              }}
            />
          </div>

          {/* Send Button - iMessage Style */}
          <button
            onClick={handleSend}
            disabled={isTyping || !inputValue.trim()}
            className="w-9 h-9 rounded-full bg-[#007AFF] hover:bg-[#0051D5] disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center shadow-lg transition-all duration-200 active:scale-95 flex-shrink-0"
            style={{
              boxShadow: !isTyping && inputValue.trim() 
                ? "0 2px 8px rgba(0, 122, 255, 0.3)" 
                : "none"
            }}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
