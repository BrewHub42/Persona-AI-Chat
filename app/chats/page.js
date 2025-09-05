"use client";
import React, { useMemo, useState, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { personas, getPersonaById } from "../personas.js";
import { ArrowLeft, User } from "lucide-react";

function ChatsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const personaId = searchParams.get("persona") || personas[0].id;
  const activePersona = useMemo(() => getPersonaById(personaId), [personaId]);

  const [message, setMessage] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamResponse, setStreamResponse] = useState("");
  const [lastUserMsg, setLastUserMsg] = useState("");
  const [currentStep, setCurrentStep] = useState("");
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const [messages, setMessages] = useState([]);

  const handlePersonaChange = (id) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("persona", id);
    router.replace(`${pathname}?${params.toString()}`);
    setMessage("");
    setLastUserMsg("");
    setStreamResponse("");
    setStreaming(false);
    setCurrentStep("");
    setThinkingSteps([]);
    setMessages([]);
  };

  const handleStreamChat = async () => {
    const text = message.trim();
    if (!text || streaming) return;
    setLastUserMsg(text);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setMessage("");
    setStreaming(true);
    setCurrentStep("");
    setThinkingSteps([]);
    setStreamResponse("");

    // Local accumulators to avoid state race conditions
    let streamed = "";
    let sseBuffer = "";

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
        sseBuffer += decoder.decode(value);
        const events = sseBuffer.split("\n\n");
        sseBuffer = events.pop() || ""; // keep incomplete part
        for (const evt of events) {
          if (!evt.startsWith("data: ")) continue;
          const payload = evt.slice(6);
          let data;
          try {
            data = JSON.parse(payload);
          } catch {
            // if JSON incomplete, prepend back to buffer
            sseBuffer = payload + "\n\n" + sseBuffer;
            continue;
          }

          if (data.streaming && data.content) {
            streamed += data.content;
            setStreamResponse((prev) => prev + data.content);
          } else if (data.step === "START") {
            setCurrentStep("🔥 Starting...");
          } else if (data.step === "THINK") {
            setCurrentStep("🧠 Thinking...");
            if (data.content) setThinkingSteps((prev) => [...prev, data.content]);
          } else if (data.step === "OUTPUT") {
            setCurrentStep("📝 Generating response...");
            setStreamResponse("");
          }
        }
      }
    } catch (error) {
      setStreamResponse("Error: " + (error?.message || String(error)));
    }

    const final = streamed.trim();
    if (final) {
      setMessages((prev) => [...prev, { role: "assistant", content: final }]);
      setStreamResponse("");
      setCurrentStep("");
      setThinkingSteps([]);
    }

    setStreaming(false);
  };

  return (
    <main className="min-h-screen font-sans flex flex-col bg-[radial-gradient(80%_60%_at_50%_0%,rgba(0,0,0,0.03),transparent)] dark:bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,255,255,0.06),transparent)]">
      <section className="mx-auto max-w-4xl w-full flex-1 flex flex-col px-6 sm:px-12 py-6">
        <header className={`rounded-xl app-border ${activePersona.accent.border} p-4 sm:p-5 bg-background`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full">
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
                    // Map social labels to their corresponding SVG icons
                    const getIconSrc = (label) => {
                      if (label.includes("YouTube")) return "/assets/youtube.svg";
                      if (label.includes("Twitter") || label.includes("X/")) return "/assets/x.svg";
                      if (label.includes("LinkedIn")) return "/assets/linkedin.svg";
                      if (label.includes("GitHub")) return "/assets/github.svg";
                      if (label.includes("Website")) return "/assets/globe.svg";
                      return "/assets/globe.svg"; // fallback icon
                    };

                    const iconSrc = getIconSrc(s.label);

                    return (
                      <a
                        key={s.href}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full app-border hover:bg-neutral-100 dark:hover:bg-neutral-900 transition"
                        aria-label={s.label}
                      >
                        <img 
                          src={iconSrc} 
                          alt={s.label}
                          className="h-4 w-4"
                          onError={(e) => {
                            console.log('Failed to load icon:', iconSrc, 'for label:', s.label);
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <span className="text-[10px] hidden">{s.label.slice(0, 2)}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <User className="h-4 w-4 text-neutral-600 dark:text-neutral-300" aria-hidden="true" />
              <select
                id="persona" aria-label="Select persona"
                className="rounded-md app-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 w-56"
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
            {messages.map((m, idx) => (
              m.role === "user" ? (
                <div key={idx} className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl bg-neutral-800 text-white px-4 py-3 shadow-sm whitespace-pre-wrap">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={idx} className="flex items-start gap-3">
                  <img src={activePersona.avatar} alt="persona" className="h-8 w-8 rounded-full object-cover" />
                  <div className="max-w-[80%] rounded-2xl bg-neutral-100 dark:bg-neutral-900 px-4 py-3 shadow-sm whitespace-pre-wrap text-sm">
                    {m.content}
                  </div>
                </div>
              )
            ))}

            {streaming || streamResponse || currentStep ? (
              <div className="flex items-start gap-3">
                <img src={activePersona.avatar} alt="persona" className="h-8 w-8 rounded-full object-cover" />
                <div className="max-w-[80%] space-y-2">
                  {currentStep && (
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 italic">
                      {currentStep}
                    </div>
                  )}

                  {thinkingSteps.length > 0 && !streaming && (
                    <details className="text-xs text-neutral-500">
                      <summary className="cursor-pointer hover:text-neutral-700">
                        💭 View thinking process ({thinkingSteps.length} steps)
                      </summary>
                      <div className="mt-2 space-y-1 pl-4 border-l-2 border-neutral-200 dark:border-neutral-700">
                        {thinkingSteps.map((step, i) => (
                          <div key={i} className="text-neutral-600 dark:text-neutral-400">
                            {step}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}

                  {streamResponse && (
                    <div className="rounded-2xl bg-neutral-100 dark:bg-neutral-900 px-4 py-3 shadow-sm whitespace-pre-wrap text-sm">
                      {streamResponse}
                    </div>
                  )}
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

export default function Chats() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatsContent />
    </Suspense>
  );
}
