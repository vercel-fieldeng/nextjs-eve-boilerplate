"use client";

import { useRef } from "react";
import { useEveAgent } from "eve/react";

export default function Home() {
  const agent = useEveAgent();
  const isBusy = agent.status === "submitted" || agent.status === "streaming";
  const hasMessages = agent.data.messages.length > 0;
  const formRef = useRef<HTMLFormElement>(null);

  function submitMessage(form: HTMLFormElement) {
    const data = new FormData(form);
    const message = String(data.get("message") ?? "").trim();
    if (message.length === 0) return;
    void agent.send({ message });
    form.reset();
  }

  const composer = (
    <form
      ref={formRef}
      className="flex w-full items-end gap-2 rounded-3xl border border-black/[.08] bg-white p-2 shadow-sm dark:border-white/[.145] dark:bg-zinc-900"
      onSubmit={(event) => {
        event.preventDefault();
        submitMessage(event.currentTarget);
      }}
    >
      <textarea
        name="message"
        rows={1}
        disabled={isBusy}
        placeholder="Message the assistant..."
        autoFocus
        className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-black outline-none placeholder:text-zinc-400 dark:text-zinc-50"
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (formRef.current) submitMessage(formRef.current);
          }
        }}
      />
      <button
        disabled={isBusy}
        type="submit"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-[#383838] disabled:opacity-40 dark:hover:bg-[#ccc]"
        aria-label="Send message"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      </button>
    </form>
  );

  if (!hasMessages) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
        <div className="flex w-full max-w-2xl flex-col items-center gap-6">
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
            How can I help you today?
          </h1>
          {composer}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex w-full max-w-2xl flex-1 flex-col gap-6 overflow-y-auto px-6 py-8">
        {agent.data.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={
                message.role === "user"
                  ? "max-w-[80%] rounded-2xl bg-foreground px-4 py-2 text-sm text-background"
                  : "max-w-[80%] text-sm text-black dark:text-zinc-50"
              }
            >
              {message.parts.map((part, index) =>
                part.type === "text" ? (
                  <p key={index} className="whitespace-pre-wrap">
                    {part.text}
                  </p>
                ) : null,
              )}
            </div>
          </div>
        ))}
        {agent.error ? (
          <p className="text-sm text-red-600">{agent.error.message}</p>
        ) : null}
      </div>
      <div className="w-full max-w-2xl px-6 pb-8">{composer}</div>
    </div>
  );
}
