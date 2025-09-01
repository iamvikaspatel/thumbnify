"use client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { authenticator } from "@/lib/authenticator";
import { upload } from "@imagekit/next";
import { WandSparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  transformImageKitUrl,
  parseCustomAspectRatio,
  ASPECT_RATIO_PRESETS,
} from "@/lib/utils";
import ChatMessageArea from "@/components/generate/ChatMessageArea";
import FormModeLayout from "@/components/generate/FormModeLayout";

// Form data types
export interface ThumbnailFormData {
  videoType: string;
  style: string;
  mood: string;
  photoPlacement: string;
  orientation: string;
  customAspectRatio?: string;
}

const GeneratePage = () => {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);


  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);

  // Interface mode state
  const [interfaceMode, setInterfaceMode] = useState<"form" | "chat">("form");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Dialog and form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ThumbnailFormData>({
    videoType: "",
    style: "",
    mood: "",
    photoPlacement: "",
    orientation: "",
    customAspectRatio: "",
  });
  const { messages, sendMessage, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/generate-thumbnail",
    }),
    onFinish: async (message) => {
      console.log("Chat finished with message:", message);
      setIsGenerating(false);

      // Only clear form state if we're still in form mode
      if (interfaceMode === "form") {
        setIsDialogOpen(false);
        setInput("");
        setSelectedFile(null);
        setUploadedImageUrl(null);
        setCurrentStep(1);
        setFormData({
          videoType: "",
          style: "",
          mood: "",
          photoPlacement: "",
          orientation: "",
          customAspectRatio: "",
        });
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);
      setIsGenerating(false);
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null!);
  const chatMessagesRef = useRef<HTMLDivElement>(null!);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatMessagesRef.current && interfaceMode === "chat") {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, interfaceMode]);

  // Form options
  const formOptions = {
    videoType: [
      { value: "gaming", label: "Gaming Thumbnail" },
      { value: "tutorial", label: "Tutorial Thumbnail" },
      { value: "vlog", label: "Vlog Thumbnail" },
      { value: "review", label: "Review Thumbnail" },
      { value: "course", label: "Course Thumbnail" },
      { value: "entertainment", label: "Entertainment Thumbnail" },
    ],
    style: [
      { value: "modern", label: "Modern" },
      { value: "vintage", label: "Vintage" },
      { value: "minimalist", label: "Minimalist" },
      { value: "bold", label: "Bold" },
      { value: "professional", label: "Professional" },
    ],
    mood: [
      { value: "exciting", label: "Exciting" },
      { value: "professional", label: "Professional" },
      { value: "fun", label: "Fun" },
      { value: "serious", label: "Serious" },
      { value: "educational", label: "Educational" },
      { value: "mysterious", label: "Mysterious" },
    ],
    photoPlacement: [
      { value: "left", label: "Left Side" },
      { value: "right", label: "Right Side" },
      { value: "center", label: "Center" },
    ],
    orientation: [
      { value: "horizontal", label: "Horizontal (16:9) - YouTube" },
      { value: "vertical", label: "Vertical (9:16) - Stories" },
      { value: "square", label: "Square (1:1) - Instagram" },
    ],
  };

  const totalSteps = 5;

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setProgress(0);
      setUploadedImageUrl(null);

      // Automatically start upload
      try {
        await handleUpload(file);
      } catch (error) {
        console.error("Auto-upload failed:", error);
        // The error is already handled in handleUpload, so we don't need to do anything else
      }
    }
  };

  const handleUpload = async (fileToUpload?: File) => {
    const file = fileToUpload || selectedFile;
    if (!file) {
      throw new Error("No file selected");
    }

    setIsUploading(true);
    setProgress(0);

    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      setIsUploading(false);
      throw new Error("Authentication failed");
    }

    const { signature, expire, token, publicKey } = authParams;

    try {
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file: file,
        fileName: file.name,
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
      });

      console.log("Upload response:", uploadResponse);
      const imageUrl = uploadResponse.url;
      setUploadedImageUrl(imageUrl || null);
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const clearUploadedImage = () => {
    setUploadedImageUrl(null);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Form helper functions
  const updateFormData = (field: keyof ThumbnailFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.videoType !== "";
      case 2:
        return formData.style !== "";
      case 3:
        return formData.mood !== "";
      case 4:
        return formData.photoPlacement !== "";
      case 5:
        if (formData.orientation === "custom") {
          return !!(
            formData.customAspectRatio &&
            formData.customAspectRatio.trim() !== "" &&
            parseCustomAspectRatio(formData.customAspectRatio) !== null
          );
        }
        return formData.orientation !== "";
      default:
        return false;
    }
  };

  const handleGenerate = () => {
    // Check if user has uploaded image and entered text
    if (!uploadedImageUrl || !input.trim()) {
      // Show user-friendly message about requirements
      if (!uploadedImageUrl && !input.trim()) {
        alert("Please upload an image and enter text to generate a thumbnail.");
      } else if (!uploadedImageUrl) {
        alert("Please upload an image to generate a thumbnail.");
      } else if (!input.trim()) {
        alert("Please enter text to generate a thumbnail.");
      }
      return;
    }

    // Open the multi-step form dialog immediately - background processing can continue
    setIsDialogOpen(true);
    setCurrentStep(1);
  };

  const resetToFormMode = () => {
    // Clear chat messages
    setMessages([]);

    // Reset to form mode
    setInterfaceMode("form");
    setInput("");
    setSelectedFile(null);
    setUploadedImageUrl(null);
    setCurrentStep(1);
    setFormData({
      videoType: "",
      style: "",
      mood: "",
      photoPlacement: "",
      orientation: "",
      customAspectRatio: "",
    });
  };

  const handleFinalGenerate = async () => {
    try {
      setIsGenerating(true);

      // 1. Close dialog immediately
      setIsDialogOpen(false);

      // 2. Start transition animation
      setIsTransitioning(true);

      // 3. Switch to chat mode after a brief delay for smooth transition
      setTimeout(() => {
        setInterfaceMode("chat");
      }, 300);

      const parts: Array<
        | { type: "text"; text: string }
        | { type: "file"; mediaType: string; url: string; filename?: string }
      > = [];

      // First, get the rewritten prompt
      const promptResponse = await fetch("/api/rewrite-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input, formData }),
      });
      const { rewrittenPrompt } = await promptResponse.json();
      console.log("Rewritten prompt:", rewrittenPrompt);

      parts.push({ type: "text" as const, text: rewrittenPrompt });

      if (uploadedImageUrl) {
        // Use the uploaded image URL
        const baseImageUrl = uploadedImageUrl;
        let transformedUrl = baseImageUrl;

        if (formData.orientation) {
          if (formData.orientation === "custom" && formData.customAspectRatio) {
            // Handle custom aspect ratio
            const customDimensions = parseCustomAspectRatio(
              formData.customAspectRatio
            );
            if (customDimensions) {
              transformedUrl = transformImageKitUrl(
                baseImageUrl,
                formData.orientation,
                customDimensions
              );
            }
          } else if (ASPECT_RATIO_PRESETS[formData.orientation]) {
            // Handle preset aspect ratios
            transformedUrl = transformImageKitUrl(
              baseImageUrl,
              formData.orientation
            );
          } else {
            // Handle custom ratio formats like "19:6", "4:3", etc.
            const customDimensions = parseCustomAspectRatio(
              formData.orientation
            );
            if (customDimensions) {
              transformedUrl = transformImageKitUrl(
                baseImageUrl,
                formData.orientation,
                customDimensions
              );
            }
          }
        }

        parts.push({
          type: "file" as const,
          mediaType: selectedFile?.type || "application/octet-stream",
          url: transformedUrl,
          filename: selectedFile?.name,
        });
      }

      

      // 4. Send message after transition starts
      setTimeout(() => {
        sendMessage({ role: "user", parts });
        setIsTransitioning(false);
      }, 300);

      // Note: Form state will be cleared in onFinish callback after successful generation
    } catch (error) {
      console.error("Error during generation:", error);
      setIsGenerating(false);
      setIsTransitioning(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl opacity-20 pointer-events-none animate-pulse" />
      <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl opacity-15 pointer-events-none animate-pulse" />

      <style jsx>{`
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes typingDots {
          0%,
          60%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .chat-message-enter {
          animation: messageSlideIn 0.4s ease-out;
        }

        .chat-input-enter {
          animation: slideInFromBottom 0.5s ease-out;
        }

        .form-enter {
          animation: fadeInScale 0.4s ease-out;
        }

        .typing-indicator {
          animation: typingDots 1.4s infinite ease-in-out;
        }

        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .message-hover:hover {
          transform: translateY(-1px);
          transition: transform 0.2s ease-out;
        }

        .scroll-smooth {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar for chat */
        .chat-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-scroll::-webkit-scrollbar-thumb {
          background: rgba(var(--primary), 0.3);
          border-radius: 3px;
        }

        .chat-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--primary), 0.5);
        }
      `}</style>
      <Header resetToFormMode={resetToFormMode} />

      {interfaceMode === "form" ? (
        // Form Mode Layout
        <FormModeLayout
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileSelect}
          uploadedImageUrl={uploadedImageUrl}
          isUploading={isUploading}
          progress={progress}
          clearUploadedImage={clearUploadedImage}
          triggerFileSelect={triggerFileSelect}
          input={input}
          setInput={setInput}
          isGenerating={isGenerating}
          handleGenerate={handleGenerate}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          formData={formData}
          setFormData={setFormData}
          formOptions={formOptions}
          totalSteps={totalSteps}
          updateFormData={updateFormData}
          nextStep={nextStep}
          prevStep={prevStep}
          isStepValid={isStepValid}
          handleFinalGenerate={handleFinalGenerate}
        />
      ) : (
        // Chat Mode Layout with Sidebar - Full Screen
        <main
          className={`transition-all duration-500 relative z-10 ${
            isTransitioning ? "opacity-50" : "opacity-100"
          } h-screen`}
        >
          <div className="flex h-full">
            {/* Enhanced Sidebar */}
            <div className="w-80 bg-card/50 backdrop-blur-xl border-r border-border/30 p-6 pt-8 flex-col relative overflow-hidden hidden md:flex h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* Enhanced Sidebar Header */}
              <div className="relative z-10 mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center shadow-xl">
                      <WandSparkles className="w-7 h-7 text-primary" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl blur-lg opacity-50 scale-110"></div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">
                      AI Assistant
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Thumbnail Generator
                    </p>
                  </div>
                </div>

                {/* Enhanced Chat Stats */}
                <div className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-border/30 shadow-lg">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="group">
                      <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                        {messages.length}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">
                        Messages
                      </div>
                    </div>
                    <div className="group">
                      <div className="text-2xl font-bold text-foreground group-hover:text-secondary transition-colors duration-200">
                        {
                          messages.filter((m) =>
                            m.parts.some((p) => p.type === "file")
                          ).length
                        }
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">
                        Generated
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Tips Card */}
                <div className="bg-gradient-to-br from-secondary/10 to-accent/10 rounded-2xl p-4 border border-secondary/20 shadow-lg backdrop-blur-sm">
                  <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-secondary/30 to-accent/30 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-sm">💡</span>
                    </div>
                    Pro Tips
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Be specific about colors and style</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Mention your target audience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Ask for multiple variations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Request specific text placement</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Enhanced Sidebar Actions */}
              <div className="relative z-10 space-y-4">
                <Button
                  onClick={resetToFormMode}
                  className="w-full justify-start h-12 bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                >
                  <WandSparkles className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-200" />
                  Start New Session
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-center hover:bg-secondary/10 border-secondary/20 hover:border-secondary/40 transition-all duration-200"
                    onClick={() => {
                      if (chatMessagesRef.current) {
                        chatMessagesRef.current.scrollTop = 0;
                      }
                    }}
                  >
                    <ChevronLeft className="w-3 h-3 mr-1 rotate-90" />
                    Top
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-center hover:bg-accent/10 border-accent/20 hover:border-accent/40 transition-all duration-200"
                    onClick={() => {
                      if (chatMessagesRef.current) {
                        chatMessagesRef.current.scrollTop =
                          chatMessagesRef.current.scrollHeight;
                      }
                    }}
                  >
                    <ChevronRight className="w-3 h-3 mr-1 rotate-90" />
                    Bottom
                  </Button>
                </div>

                {/* Enhanced Quick Prompts */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-accent/30 to-primary/30 rounded-md flex items-center justify-center">
                      <span className="text-xs">⚡</span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground">
                      Quick Prompts
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {[
                      { text: "Make it more vibrant", icon: "🎨" },
                      { text: "Add gaming elements", icon: "🎮" },
                      { text: "Professional style", icon: "💼" },
                      { text: "Different color scheme", icon: "🌈" },
                    ].map((prompt, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-sm text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 transition-all duration-300 group border border-transparent hover:border-primary/20 rounded-xl p-3 h-auto"
                        onClick={() => setInput(prompt.text)}
                      >
                        <span className="mr-3 text-base group-hover:scale-110 transition-transform duration-200">
                          {prompt.icon}
                        </span>
                        <span className="flex-1 text-left">{prompt.text}</span>
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enhanced Sidebar Footer */}
              <div className="mt-auto relative z-10">
                <div className="bg-gradient-to-r from-muted/30 to-muted/20 rounded-lg p-3 border border-border/30">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isGenerating
                            ? "bg-yellow-500 animate-pulse"
                            : "bg-green-500"
                        }`}
                      ></div>
                      <span className="text-muted-foreground">
                        {isGenerating ? "AI Working..." : "Ready to Chat"}
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      {messages.length} msgs
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full">
              

              {/* Chat Messages Area */}
              <ChatMessageArea
                chatMessagesRef={chatMessagesRef}
                messages={messages}
                isGenerating={isGenerating}
              />

              {/* Enhanced Chat Input Area */}
              <div className="border-t border-border/20 bg-gradient-to-r from-background/80 via-background/60 to-background/80 backdrop-blur-xl">
                <div className="p-4 md:p-6">
                  <div className="bg-card/60 backdrop-blur-xl rounded-3xl border-2 border-border/30 shadow-2xl relative overflow-hidden transition-all duration-300 hover:shadow-3xl focus-within:shadow-3xl focus-within:border-primary/40 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/8 pointer-events-none rounded-3xl group-focus-within:from-primary/12 group-focus-within:to-secondary/12 transition-all duration-300" />
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />

                    {/* Input Container */}
                    <div className="relative z-10 p-3">
                      <div className="flex items-end space-x-3">
                        {/* Text Input */}
                        <div className="flex-1 relative">
                          <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Describe changes, ask for variations, or request a completely new thumbnail..."
                            className="w-full min-h-[50px] max-h-[120px] resize-none bg-transparent focus:ring-0 focus:outline-none placeholder:text-muted-foreground/60 text-foreground leading-relaxed border-0 text-base p-2"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                if (input.trim() && !isGenerating) {
                                  setIsGenerating(true);
                                  sendMessage({
                                    role: "user",
                                    parts: [{ type: "text", text: input }],
                                  });
                                  setInput("");
                                }
                              }
                            }}
                            disabled={isGenerating}
                          />

                          {/* Enhanced Character Counter */}
                          <div className="absolute bottom-3 right-3 text-xs text-muted-foreground/60 bg-card/80 backdrop-blur-sm px-2 py-1 rounded-md">
                            {input.length}/500
                          </div>
                        </div>

                        {/* Enhanced Send Button */}
                        <div className="flex flex-col items-center space-y-2">
                          <Button
                            onClick={() => {
                              if (input.trim() && !isGenerating) {
                                setIsGenerating(true);
                                sendMessage({
                                  role: "user",
                                  parts: [{ type: "text", text: input }],
                                });
                                setInput("");
                              }
                            }}
                            disabled={!input.trim() || isGenerating}
                            className={`relative overflow-hidden transition-all duration-300 h-12 px-5 group ${
                              !input.trim() || isGenerating
                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : "bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 text-white shadow-xl hover:shadow-2xl hover:scale-105"
                            }`}
                            size="lg"
                          >
                            {isGenerating ? (
                              <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                                <span className="text-base font-medium">Generating</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-3">
                                <WandSparkles className="h-6 w-6 group-hover:rotate-12 transition-transform duration-200" />
                                <span className="text-base font-medium">
                                  Generate
                                </span>
                              </div>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Input Footer */}
                    <div className="px-4 pb-3 flex items-center justify-between text-xs text-muted-foreground/70">
                      <div className="flex items-center space-x-4">
                        <span>
                          Press Enter to send, Shift+Enter for new line
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isGenerating
                              ? "bg-yellow-500 animate-pulse"
                              : "bg-green-500 animate-pulse"
                          }`}
                        ></div>
                        <span>{isGenerating ? "AI Working" : "AI Ready"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default GeneratePage;
