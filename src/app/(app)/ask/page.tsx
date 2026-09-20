"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot,
  MessageSquareText,
  Send,
  Sparkles,
  User2,
} from "lucide-react";
import { Card, cx } from "@/components/ui";
import { useJourney } from "@/lib/store";
import { answerQuestion, type AssistantReply } from "@/lib/ask";

const SUGGESTED = [
  "Why did my roadmap change?",
  "What should I learn this week?",
  "What is my biggest skill gap?",
  "How close am I to my target role?",
  "Which project should I build after this roadmap?",
];

interface ChatItem {
  who: "user" | "agent";
  text: string;
  intent?: string;
  suggestedNext?: string[];
}

export default function AskPage() {
  const { state } = useJourney();
  const [items, setItems] = useState<ChatItem[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [items, thinking]);

  function ask(q: string) {
    if (!q.trim() || thinking) return;
    setItems((prev) => [...prev, { who: "user", text: q }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const reply: AssistantReply = answerQuestion(state, q);
      setItems((prev) => [
        ...prev,
        {
          who: "agent",
          text: reply.answer,
          intent: reply.intent,
          suggestedNext: reply.suggestedNext,
        },
      ]);
      setThinking(false);
    }, 550);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-3xl flex-col space-y-4">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
          <MessageSquareText className="h-6 w-6 text-accent" />
          Ask EduPath
        </h1>
        <p className="mt-1 text-[14px] text-foreground/55">
          A grounded assistant — answers come from your actual profile, gaps, roadmap, and assessment
          evidence, not from a generic script.
        </p>
      </div>

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5" aria-live="polite">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-8 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <Bot className="h-7 w-7" />
              </span>
              <div>
                <p className="font-semibold">Ask anything about your journey</p>
                <p className="mt-1 text-[13px] text-foreground/55">
                  Try one of these — each reads your live learner state.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-[12.5px] font-medium text-foreground/70 hover:bg-muted hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <AnimatePresence initial={false}>
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cx("flex items-start gap-2.5", item.who === "user" && "flex-row-reverse")}
              >
                <span
                  className={cx(
                    "flex h-8 w-8 flex-none items-center justify-center rounded-full",
                    item.who === "user" ? "bg-accent text-white" : "bg-accent-soft text-accent"
                  )}
                >
                  {item.who === "user" ? <User2 className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </span>
                <div className={cx("min-w-0", item.who === "user" ? "text-right" : "flex-1")}>
                  <div
                    className={cx(
                      "inline-block max-w-[92%] whitespace-pre-wrap rounded-2xl border px-4 py-3 text-left text-[13.5px] leading-relaxed",
                      item.who === "user"
                        ? "border-transparent bg-accent text-white"
                        : "border-border bg-muted/50 text-foreground/85"
                    )}
                  >
                    {item.text}
                  </div>
                  {item.who === "agent" ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.intent ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[10.5px] font-semibold text-accent">
                          <Sparkles className="h-2.5 w-2.5" /> intent: {item.intent}
                        </span>
                      ) : null}
                      {item.suggestedNext?.slice(0, 2).map((s) => (
                        <button
                          key={s}
                          onClick={() => ask(s)}
                          className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-foreground/55 hover:bg-muted hover:text-foreground"
                        >
                          {s} →
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {thinking ? (
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-accent-soft text-accent">
                <Bot className="h-4 w-4" />
              </span>
              <div className="rounded-2xl border border-border bg-muted/50 px-4 py-3">
                <span className="flex items-center gap-1.5 text-[12.5px] text-foreground/55">
                  Reading your live state
                  <span className="flex gap-1">
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }}>.</motion.span>
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}>.</motion.span>
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}>.</motion.span>
                  </span>
                </span>
              </div>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. I only have 5 hours this week. Can you adjust my plan?"
              className="h-11 flex-1 rounded-xl border border-border bg-card px-4 text-[13.5px] outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/15"
            />
            <button
              type="submit"
              disabled={!input.trim() || thinking}
              className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-accent text-on-accent transition-colors hover:bg-accent-hover disabled:pointer-events-none disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>
      </Card>

      {!state.profile ? (
        <p className="text-center text-[12px] text-foreground/40">
          No learner state loaded yet — answers will run in a general explanation mode.
        </p>
      ) : null}
    </div>
  );
}