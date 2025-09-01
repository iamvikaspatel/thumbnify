import { Download, WandSparkles } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { UIMessage } from "@ai-sdk/react";

const ChatMessageArea = ({
  chatMessagesRef,
  messages,
  isGenerating,
}: {
  chatMessagesRef: React.RefObject<HTMLDivElement>;
  messages: UIMessage[];
  isGenerating: boolean;
}) => {
  return (
    <div
      ref={chatMessagesRef}
      className="flex-1 overflow-y-auto p-3 md:p-4 pt-6 md:pt-8 space-y-6 scroll-smooth chat-scroll mt-10"
      style={{ scrollBehavior: "smooth" }}
    >
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md relative">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl blur-2xl opacity-50 scale-150"></div>

            <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <WandSparkles className="w-10 h-10 text-primary animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Ready to Create Magic
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Start a conversation to generate and refine your perfect
                thumbnail. Describe what you want or ask for variations.
              </p>

              {/* Quick tips */}
              <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Be specific about colors and style</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                  <span>Mention your target audience</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  <span>Ask for multiple variations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex animate-in slide-in-from-bottom-2 duration-500 ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div
            className={`${
              message.role === "user"
                ? "max-w-[60%] md:max-w-[50%] lg:max-w-[40%] ml-4 md:ml-8"
                : "max-w-[85%] md:max-w-[75%] lg:max-w-[70%] mr-4 md:mr-8"
            }`}
          >
            {/* Message Header */}
            <div
              className={`flex items-center gap-2 mb-2 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-center gap-2 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                      : "bg-gradient-to-br from-secondary/20 to-accent/20 text-secondary border border-secondary/20"
                  }`}
                >
                  {message.role === "user" ? "You" : "AI"}
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Enhanced Message Content */}
            <div
              className={`rounded-2xl shadow-xl backdrop-blur-sm border transition-all duration-300 hover:shadow-2xl message-hover group ${
                message.role === "user"
                  ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-primary/20 p-4 hover:scale-[1.02]"
                  : "bg-card/80 border-border/50 relative overflow-hidden p-6 hover:bg-card/90"
              }`}
            >
              {message.role === "assistant" && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-accent/10 pointer-events-none rounded-2xl" />
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </>
              )}

              <div className="relative z-10">
                {message.role === "user"
                  ? // User messages: Show both text and images
                    message.parts.map((part, i) => {
                      if (part.type === "text") {
                        return (
                          <div
                            key={i}
                            className="prose prose-sm max-w-none mb-3"
                          >
                            <p className="mb-0 leading-relaxed whitespace-pre-wrap text-primary-foreground">
                              {part.text}
                            </p>
                          </div>
                        );
                      } else if (
                        part.type === "file" &&
                        part.mediaType?.startsWith("image/")
                      ) {
                        return (
                          <div
                            key={i}
                            className="group mt-4 flex justify-center"
                          >
                            <div className="relative overflow-hidden rounded-2xl border-2 border-border/30 shadow-xl hover:shadow-2xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
                              <Image
                                src={part.url}
                                alt="Generated thumbnail"
                                width={400}
                                height={400}
                                className="w-full h-auto max-w-sm group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                              {/* Enhanced download button */}
                              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <Button
                                  size="sm"
                                  className="bg-card/95 hover:bg-card text-foreground shadow-xl border border-border/50 backdrop-blur-sm hover:scale-105 transition-all duration-200 cursor-pointer"
                                  onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = part.url;
                                    link.download = "thumbnail.png";
                                    link.click();
                                  }}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </Button>
                              </div>

                              {/* Glow effect */}
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10 scale-110"></div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })
                  : // AI messages: Show both text and images (smaller)
                    message.parts.map((part, i) => {
                      if (part.type === "text") {
                        return (
                          <div
                            key={i}
                            className="prose prose-sm max-w-none mb-3"
                          >
                            <p className="mb-0 leading-relaxed whitespace-pre-wrap text-foreground">
                              {part.text}
                            </p>
                          </div>
                        );
                      } else if (
                        part.type === "file" &&
                        part.mediaType?.startsWith("image/")
                      ) {
                        return (
                          <div
                            key={i}
                            className="mt-3 group flex justify-center"
                          >
                            <div className="relative overflow-hidden rounded-xl border border-border/30 shadow-md hover:shadow-lg transition-all duration-300">
                              <Image
                                src={part.url}
                                alt="Generated thumbnail"
                                width={400}
                                height={400}
                                className="w-full h-auto max-w-sm group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="bg-background/90 hover:bg-background text-foreground shadow-lg cursor-pointer"
                                  onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = part.url;
                                    link.download = "thumbnail.png";
                                    link.click();
                                  }}
                                >
                                  <Download className="w-3 h-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Enhanced Typing Indicator */}
      {isGenerating && (
        <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
          <div className="mr-4 md:mr-8 max-w-[85%] md:max-w-[75%] lg:max-w-[70%]">
            {/* AI Header */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm bg-gradient-to-br from-secondary/20 to-accent/20 text-secondary border border-secondary/20">
                AI
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* Typing Indicator */}
            <div className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-2xl p-3 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-accent/5 pointer-events-none rounded-2xl" />
              <div className="flex items-center space-x-3 relative z-10">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-secondary rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-accent rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  AI is generating your thumbnail...
                </span>
                <div className="ml-auto">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary/30 border-t-primary"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessageArea;
