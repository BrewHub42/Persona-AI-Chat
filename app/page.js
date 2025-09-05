import Link from "next/link";
import { personas } from "./personas";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-10 sm:px-12 sm:py-14 font-sans bg-[radial-gradient(80%_60%_at_50%_0%,rgba(0,0,0,0.03),transparent)] dark:bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,255,255,0.06),transparent)]">
      <section className="mx-auto max-w-6xl">
        <header className="mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 app-border text-xs font-medium">
            <span className="font-semibold">ByteMentor</span>
            <span className="hidden sm:inline text-neutral-500">AI‑Powered Conversations</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight">
            Chat, learn, and collaborate with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500"> expert personas</span>
            tailored to your needs
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl">
            Pick a persona and start a casual chat. Get crisp answers, code tips, and design feedback.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/chats?persona=${personas[0].id}`} className={`rounded-full px-5 py-2 text-sm font-medium ${personas[0].accent.button}`}>
              Start Chatting
            </Link>
          </div>
        </header>

        <div id="personas" className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {personas.map((p) => (
            <article
              key={p.id}
              className={`group relative rounded-2xl app-border ${p.accent.border} p-5 sm:p-6 bg-background shadow-sm transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:scale-[1.01]`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`relative h-14 w-14 rounded-full ring-4 ${p.accent.ring} transition-transform duration-300 group-hover:scale-110`}>
                    <img src={p.avatar} alt={`${p.name} avatar`} className="h-14 w-14 rounded-full object-cover" />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
                  </div>
                  <div>
                    <h2 className={`text-xl sm:text-2xl font-semibold ${p.accent.text}`}>{p.name}</h2>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{p.tagline}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${p.accent.badge}`}>Persona</span>
              </div>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-200">{p.bio}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {p.socials.map((s) => {
                  // Map social labels to their corresponding SVG icons
                  const getIconSrc = (label) => {
                    if (label.includes("YouTube")) return "/assets/youtube.svg";
                    if (label.includes("Twitter") || label.includes("X/")) return "/assets/x.svg";
                    if (label.includes("LinkedIn")) return "/assets/linkedin.svg";
                    if (label.includes("GitHub")) return "/assets/github.svg";
                    if (label.includes("Website")) return "/assets/globe.svg";
                    return "/assets/globe.svg"; // fallback icon
                  };

                  return (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full app-border hover:bg-neutral-100 dark:hover:bg-neutral-900 transition"
                      aria-label={s.label}
                    >
                      <img 
                        src={getIconSrc(s.label)} 
                        alt={s.label}
                        className="h-4 w-4"
                      />
                    </a>
                  );
                })}
              </div>

              <div className="mt-6">
                <Link
                  href={`/chats?persona=${p.id}`}
                  className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium ${p.accent.button} transition-all duration-300 transform hover:-translate-y-0.5`}
                >
                  Start Chatting
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
