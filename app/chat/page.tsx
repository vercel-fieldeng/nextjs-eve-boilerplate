"use client";

import { useEveAgent } from "eve/react";

export default function ChatPage() {
  const agent = useEveAgent();
  const isBusy = agent.status === "submitted" || agent.status === "streaming";

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-4 py-16 px-6">
        <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
          Chat
        </h1>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
          {agent.data.messages.map((message) => (
            <article
              key={message.id}
              className="rounded-lg border border-black/[.08] p-3 dark:border-white/[.145]"
            >
              <header className="mb-1 text-xs font-medium uppercase text-zinc-500">
                {message.role}
              </header>
              {message.parts.map((part, index) =>
                part.type === "text" ? (
                  <p key={index} className="text-sm text-black dark:text-zinc-50">
                    {part.text}
                  </p>
                ) : null,
              )}
            </article>
          ))}
        </div>

        {agent.error ? (
          <p className="text-sm text-red-600">{agent.error.message}</p>
        ) : null}

        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const message = String(form.get("message") ?? "").trim();
            if (message.length > 0) {
              void agent.send({ message });
              event.currentTarget.reset();
            }
          }}
        >
          <input
            name="message"
            disabled={isBusy}
            placeholder="Send a message"
            className="flex-1 rounded-full border border-black/[.08] px-4 py-2 text-sm outline-none dark:border-white/[.145] dark:bg-zinc-900"
            autoComplete="off"
          />
          <button
            disabled={isBusy}
            type="submit"
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
