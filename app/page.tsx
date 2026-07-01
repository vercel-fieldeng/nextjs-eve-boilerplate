"use client";

import { ArrowUpIcon, PlusIcon, SquareIcon, XIcon } from "lucide-react";
import { useEveAgent } from "eve/react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Shimmer } from "@/components/ai-elements/shimmer";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { InputGroupAddon } from "@/components/ui/input-group";

export default function Home() {
  const agent = useEveAgent();
  const status = agent.status;
  const isGenerating = status === "submitted" || status === "streaming";
  const hasMessages = agent.data.messages.length > 0;

  const lastMessage = agent.data.messages.at(-1);
  const isWaitingForFirstToken =
    isGenerating &&
    (!lastMessage ||
      lastMessage.role !== "assistant" ||
      !lastMessage.parts.some((part) => part.type === "text" && part.text.trim().length > 0));

  function handleSubmit({ text }: PromptInputMessage) {
    if (!text.trim() || isGenerating) return;
    void agent.send({ message: text });
  }

  function handleNewChat() {
    agent.stop();
    agent.reset();
  }

  const submitIcon =
    status === "submitted" ? (
      <Spinner />
    ) : status === "streaming" ? (
      <SquareIcon className="size-4" />
    ) : status === "error" ? (
      <XIcon className="size-4" />
    ) : (
      <ArrowUpIcon className="size-4" />
    );

  const composer = (
    <PromptInput onSubmit={handleSubmit} className="rounded-full p-2 shadow-sm">
      <PromptInputTextarea
        placeholder="Message the assistant..."
        className="min-h-9 py-1.5 pr-2 pl-3 text-base"
        rows={1}
      />
      <InputGroupAddon align="inline-end" className="pr-1">
        <PromptInputSubmit
          status={status}
          onStop={() => agent.stop()}
          className="size-9 rounded-full"
        >
          {submitIcon}
        </PromptInputSubmit>
      </InputGroupAddon>
    </PromptInput>
  );

  if (!hasMessages) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="flex w-full max-w-3xl flex-col items-center gap-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            How can I help you today?
          </h1>
          <div className="w-full">{composer}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur-sm">
        <span className="text-sm font-medium text-foreground">eve chat</span>
        <Button variant="outline" size="sm" className="gap-1.5 rounded-full" onClick={handleNewChat}>
          <PlusIcon className="size-3.5" />
          New chat
        </Button>
      </header>

      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl gap-6 py-8">
          {agent.data.messages.map((message) => (
            <Message from={message.role} key={message.id}>
              <MessageContent className="text-base leading-7">
                {message.parts.map((part, index) =>
                  part.type === "text" && part.text.length > 0 ? (
                    <MessageResponse key={index}>{part.text}</MessageResponse>
                  ) : null,
                )}
              </MessageContent>
            </Message>
          ))}

          {isWaitingForFirstToken ? (
            <Message from="assistant">
              <MessageContent className="text-base leading-7">
                <Shimmer>Thinking...</Shimmer>
              </MessageContent>
            </Message>
          ) : null}

          {agent.error ? (
            <p className="text-sm text-destructive">{agent.error.message}</p>
          ) : null}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="mx-auto w-full max-w-3xl px-4 pb-6">{composer}</div>
    </div>
  );
}
