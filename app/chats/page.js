"use client";
import React, { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { personas, getPersonaById } from "../personas.js";
import { Youtube, Twitter, Linkedin, ArrowLeft } from "lucide-react";

export default function Chats() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const personaId = searchParams.get("persona") || personas[0].id;
  const activePersona = useMemo(() => getPersonaById(personaId), [personaId]);

  const [message, setMessage] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamResponse, setStreamResponse] = useState("");
  const [lastUserMsg, setLastUserMsg] = useState("");

  const handlePersonaChange = (id) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("persona", id);
    router.replace(`${pathname}?${params.toString()}`);
    setMessage("");
    setLastUserMsg("");
    setStreamResponse("");
    setStreaming(false);
  };

  const handleStreamChat = async () => {
    const text = message.trim();
    if (!text || streaming) return;
    setLastUserMsg(text);
    setMessage("");
    setStreaming(true);
    setStreamResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, persona: activePersona.id }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            setStreamResponse((prev) => prev + data.content);
          }
        }
      }
    } catch (error) {
      setStreamResponse("Error: " + (error?.message || String(error)));
    }

    setStreaming(false);
  };

  return (
    <main className="min-h-screen font-sans flex flex-col bg-[radial-gradient(80%_60%_at_50%_0%,rgba(0,0,0,0.03),transparent)] dark:bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,255,255,0.06),transparent)]">
      <section className="mx-auto max-w-4xl w-full flex-1 flex flex-col px-6 sm:px-12 py-6">
        <header className={`rounded-xl app-border ${activePersona.accent.border} p-4 sm:p-5 bg-background`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="mr-2 inline-flex h-9 w-9 items-center justify-center rounded-full app-border hover:bg-neutral-100 dark:hover:bg-neutral-900 transition"
                aria-label="Back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className={`h-12 w-12 rounded-full ring-4 ${activePersona.accent.ring} overflow-hidden transition-transform duration-300`}>
                <img src={activePersona.avatar} alt={`${activePersona.name} avatar`} className="h-12 w-12 object-cover" />
              </span>
              <div>
                <h1 className={`text-xl sm:text-2xl font-semibold ${activePersona.accent.text}`}>{activePersona.name}</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">{activePersona.tagline}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activePersona.socials.map((s) => {
                    const Icon = s.label === "YouTube" ? Youtube : s.label === "X/Twitter" ? Twitter : s.label === "LinkedIn" ? Linkedin : null;
                    return (
                      <a
                        key={s.href}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full app-border hover:bg-neutral-100 dark:hover:bg-neutral-900 transition"
                        aria-label={s.label}
                      >
                        {Icon ? <Icon className="h-4 w-4" /> : <span className="text-[10px]">{s.label}</span>}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="persona" className="text-xs text-neutral-600 dark:text-neutral-300">Persona</label>
              <select
                id="persona"
                className="rounded-md app-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
                value={personaId}
                onChange={(e) => handlePersonaChange(e.target.value)}
                disabled={streaming}
              >
                {personas.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <div className="mt-6 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {lastUserMsg && (
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl bg-neutral-800 text-white px-4 py-3 shadow-sm">
                  {lastUserMsg}
                </div>
              </div>
            )}

            {streaming || streamResponse ? (
              <div className="flex items-start gap-3">
                <img src={activePersona.avatar} alt="persona" className="h-8 w-8 rounded-full object-cover" />
                <div className="max-w-[80%] rounded-2xl bg-neutral-100 dark:bg-neutral-900 px-4 py-3 shadow-sm whitespace-pre-wrap">
                  {streamResponse}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="sticky bottom-0 left-0 right-0 mt-6 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-neutral-200 dark:border-neutral-800">
          <div className="py-4 flex items-end gap-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  handleStreamChat();
                }
              }}
              placeholder={`Ask ${activePersona.name.split(" ")[0]} anything...`}
              rows={3}
              className="w-full rounded-lg app-border bg-background p-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
              disabled={streaming}
            />
            <button
              onClick={handleStreamChat}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium ${activePersona.accent.button}`}
              disabled={!message.trim() || streaming}
            >
              {streaming ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
