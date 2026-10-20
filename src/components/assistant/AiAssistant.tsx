"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  X,
  Sparkles,
  Minimize2,
  Maximize2,
  AlertCircle
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

interface AiAssistantProps {
  topicSlug: string;
  labState?: any;
}

export default function AiAssistant({ topicSlug, labState }: AiAssistantProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "assistant",
      text: "Halo! Saya Asisten Laboratorium DILSA. Saya memantau parameter dan hasil pengukuran eksperimenmu secara langsung. Jangan ragu bertanya jika ada hasil yang ingin kamu pahami!",
      timestamp: "Sekarang"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          topic: topicSlug,
          parameters: labState?.parameters || {},
          measurements: labState?.measurements || {},
          activeStep: labState?.activeExperimentStep || 1
        })
      });

      if (!response.ok) {
        throw new Error("Gagal menghubungi asisten AI.");
      }

      const data = await response.json();
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: data.reply || "Maaf, saya tidak dapat memahami permintaan tersebut saat ini.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        text: "Koneksi asisten AI sedang terkendala, namun simulasi tetap bekerja secara penuh. Kamu bisa menggunakan panduan eksperimen dan rumus yang tertera.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Jelaskan hasil saat ini",
    "Beri petunjuk berikutnya",
    "Mengapa hasilnya berubah?",
    "Bagaimana rumus bekerja?"
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#174A8B] text-white rounded-full shadow-lg hover:bg-[#12396d] border border-white/20 transition-all hover:scale-105"
        aria-label="Buka Asisten Laboratorium DILSA"
      >
        <Bot className="w-5 h-5 text-[#FFD45A]" />
        <span className="text-xs font-semibold">Tanya Asisten Lab</span>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 bg-white rounded-2xl border border-[#DCE6F1] shadow-2xl flex flex-col transition-all duration-200 overflow-hidden ${
        isMinimized ? "w-80 h-14" : "w-96 max-w-[calc(100vw-2rem)] h-[520px] max-h-[80vh]"
      }`}
    >
      {/* Assistant Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#174A8B] text-white select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#2583E8] flex items-center justify-center">
            <Bot className="w-4 h-4 text-[#FFD45A]" />
          </div>
          <div>
            <h3 className="text-xs font-bold leading-tight flex items-center gap-1.5">
              Asisten Lab DILSA
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h3>
            <p className="text-[10px] text-[#DDF0FF]/80">
              {isLoading ? "Sedang menganalisis..." : "Siap membimbing"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10"
            title={isMinimized ? "Perbesar panel" : "Perkecil panel"}
            aria-label="Toggle ukuran panel"
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10"
            title="Tutup panel asisten"
            aria-label="Tutup panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                    m.sender === "user"
                      ? "bg-[#2583E8] text-white rounded-br-xs"
                      : "bg-white text-[#172B45] border border-[#DCE6F1] shadow-xs rounded-bl-xs"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-[#617187] mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#DCE6F1] text-xs text-[#617187] w-fit">
                <Sparkles className="w-3.5 h-3.5 text-[#2583E8] animate-spin" />
                <span>Asisten sedang menganalisis data eksperimen...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Context Prompt Chips */}
          <div className="px-3 py-2 bg-[#F3F8FF] border-t border-[#DCE6F1] flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-white text-[#174A8B] border border-[#DCE6F1] hover:bg-[#DDF0FF] hover:border-[#2583E8] transition-all disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#DCE6F1] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tanyakan konsep atau hasil..."
              disabled={isLoading}
              className="flex-1 bg-[#F8FAFC] border border-[#DCE6F1] rounded-lg px-3 py-2 text-xs text-[#172B45] placeholder-[#617187] focus:outline-none focus:border-[#2583E8] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2 rounded-lg bg-[#2583E8] text-white hover:bg-[#1f6fc7] disabled:opacity-40 transition-all shrink-0"
              aria-label="Kirim pertanyaan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
