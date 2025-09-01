import {
  ChevronLeft,
  ChevronRight,
  Paperclip,
  WandSparkles,
  X,
  Gamepad2,
  BookOpen,
  Camera,
  Star,
  GraduationCap,
  Film,
  Zap,
  Clock,
  Minus,
  Bold,
  Briefcase,
  PartyPopper,
  Smile,
  Coffee,
  Book,
  EyeOff,
  AlignStartVertical,
  AlignEndVertical,
  AlignCenterVertical,
  RectangleHorizontal,
  RectangleVertical,
  Square,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import { ThumbnailFormData } from "@/app/generate/page";

// Form options type definition
interface FormOption {
  value: string;
  label: string;
}

interface FormOptions {
  videoType: FormOption[];
  style: FormOption[];
  mood: FormOption[];
  photoPlacement: FormOption[];
  orientation: FormOption[];
}

const FormModeLayout = ({
  fileInputRef,
  handleFileSelect,
  uploadedImageUrl,
  isUploading,
  progress,
  clearUploadedImage,
  triggerFileSelect,
  input,
  setInput,
  isGenerating,
  handleGenerate,
  isDialogOpen,
  setIsDialogOpen,
  currentStep,
  setCurrentStep,
  formData,
  setFormData,
  formOptions,
  totalSteps,
  updateFormData,
  nextStep,
  prevStep,
  isStepValid,
  handleFinalGenerate,
}: {
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedImageUrl: string | null;
  isUploading: boolean;
  progress: number;
  clearUploadedImage: () => void;
  triggerFileSelect: () => void;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isGenerating: boolean;
  handleGenerate: () => void;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  formData: ThumbnailFormData;
  setFormData: React.Dispatch<React.SetStateAction<ThumbnailFormData>>;
  formOptions: FormOptions;
  totalSteps: number;
  updateFormData: (field: keyof ThumbnailFormData, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  isStepValid: (step: number) => boolean;
  handleFinalGenerate: () => void;
}) => {
  const [error, setError] = useState<string | null>(null);

  const iconMap: { [key: string]: React.ElementType } = {
    // Video Type
    gaming: Gamepad2,
    tutorial: BookOpen,
    vlog: Camera,
    review: Star,
    course: GraduationCap,
    entertainment: Film,
    // Style
    modern: Zap,
    vintage: Clock,
    minimalist: Minus,
    bold: Bold,
    professional: Briefcase,
    // Mood
    exciting: PartyPopper,
    fun: Smile,
    serious: Coffee,
    educational: Book,
    mysterious: EyeOff,
    // Photo Placement
    left: AlignStartVertical,
    right: AlignEndVertical,
    center: AlignCenterVertical,
    // Orientation
    horizontal: RectangleHorizontal,
    vertical: RectangleVertical,
    square: Square,
  };

  const handleGenerateClick = () => {
    if (!uploadedImageUrl || !input.trim()) {
      if (!uploadedImageUrl && !input.trim()) {
        setError(
          "Please upload an image and enter text to generate a thumbnail."
        );
      } else if (!uploadedImageUrl) {
        setError("Please upload an image to generate a thumbnail.");
      } else if (!input.trim()) {
        setError("Please enter text to generate a thumbnail.");
      }
      return;
    }
    setError(null);
    handleGenerate();
  };

  return (
    <main
      className={`pt-24 md:pt-28 md:pb-10 relative z-10 ${
        isDialogOpen ? "blur-sm" : ""
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Page Header */}
        <div className="text-center mb-8 form-enter">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight leading-tight">
            Generate
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent block">
              Stunning Thumbnails
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload an image and describe your vision to create professional
            thumbnails with our advanced AI-powered generation system
          </p>
        </div>

        {/* Enhanced Main Form Card */}
        <div className="bg-card/50 backdrop-blur-md border-2 border-border/50 rounded-3xl p-8 shadow-2xl sm:p-8 form-enter relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
          {/* Enhanced card gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none rounded-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {error && (
            <div
              className="mb-8 flex justify-center relative z-10"
              aria-live="polite"
            >
              <div className="relative inline-block group">
                <div className="bg-red-500 text-white p-4 rounded-lg">
                  {error}
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Image preview or loading state */}
          {(uploadedImageUrl || isUploading) && (
            <div className="mb-8 flex justify-center relative z-10">
              <div className="relative inline-block group">
                {uploadedImageUrl ? (
                  <>
                    <div className="relative overflow-hidden rounded-2xl border-2 border-border/50 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                      <Image
                        src={uploadedImageUrl}
                        alt="Uploaded preview"
                        width={320}
                        height={320}
                        className="max-w-xs h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                        onLoad={() =>
                          console.log("Image loaded:", uploadedImageUrl)
                        }
                        onError={(e) =>
                          console.error("Image failed to load:", e)
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearUploadedImage}
                      className="absolute -top-3 -right-3 h-8 w-8 p-0 bg-card/90 backdrop-blur-sm border border-border rounded-full shadow-lg hover:bg-muted hover:scale-110 transition-all duration-200 cursor-pointer"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    {/* Image glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-2xl opacity-30 scale-110 -z-10"></div>
                  </>
                ) : (
                  <div className="relative">
                    <div className="w-80 h-48 bg-gradient-to-br from-muted/50 to-muted rounded-2xl border-2 border-dashed border-border/50 shadow-lg animate-pulse relative overflow-hidden">
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-card/90 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg border border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm font-medium text-foreground">
                            Uploading... {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="w-32 h-1 bg-muted rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Text area */}
          <div className="mb-8 relative z-10">
            <Label
              htmlFor="text-input"
              className="block mb-4 ml-1 font-bold text-lg text-foreground"
            >
              Describe Your Vision
            </Label>
            <div className="relative">
              <Textarea
                id="text-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your thumbnail vision in detail... e.g., 'Gaming thumbnail with neon colors, excited expression, bold text overlay saying EPIC WIN'"
                className="min-h-32 resize-none p-6 text-base bg-card/50 backdrop-blur-sm border-2 border-border/50 rounded-2xl shadow-lg focus:border-primary/50 focus:shadow-xl transition-all duration-300 placeholder:text-muted-foreground/70"
              />
              <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-card/80 backdrop-blur-sm px-2 py-1 rounded-md">
                {input.length}/500
              </div>
            </div>
          </div>

          {/* Enhanced Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-between relative z-10">
            {/* File selection */}
            <Button
              variant="outline"
              onClick={triggerFileSelect}
              disabled={isUploading}
              className="cursor-pointer h-14 px-8 text-base border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
            >
              <Paperclip className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              {uploadedImageUrl ? "Change Image" : "Select Image"}
            </Button>

            {/* Generate button */}
            <Button
              onClick={handleGenerateClick}
              disabled={isUploading || isGenerating}
              className="cursor-pointer h-14 px-10 text-base bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
            >
              <WandSparkles className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Generating...
                </>
              ) : (
                "Generate Thumbnail"
              )}
            </Button>
          </div>
        </div>

        {/* Enhanced Multi-step Form Dialog */}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            // Prevent closing dialog while generating
            if (!isGenerating) {
              setIsDialogOpen(open);
            }
          }}
        >
          <DialogContent className="max-w-lg bg-card/95 backdrop-blur-md border border-border/50 shadow-2xl">
            <DialogHeader className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg -m-6 mb-0"></div>
              <div className="relative z-10 pt-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                    <WandSparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold text-foreground">
                      Customize Your Thumbnail
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      Step {currentStep} of {totalSteps}
                    </p>
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Enhanced Progress Indicator */}
            <div className="flex space-x-2 mb-6">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex-1 relative">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      i + 1 <= currentStep
                        ? "bg-gradient-to-r from-primary to-secondary shadow-lg"
                        : "bg-muted"
                    }`}
                  />
                  {i + 1 === currentStep && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse opacity-50"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {/* Enhanced Step 1: Video Type */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      Content Type
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      What type of content is this thumbnail for?
                    </p>
                  </div>
                  <RadioGroup
                    value={formData.videoType}
                    onValueChange={(value) =>
                      updateFormData("videoType", value)
                    }
                    className="space-y-3"
                  >
                    {formOptions.videoType.map((option) => {
                      const Icon = iconMap[option.value];
                      return (
                        <div key={option.value} className="relative">
                          <Label
                            htmlFor={option.value}
                            className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:bg-muted/50 ${
                              formData.videoType === option.value
                                ? "border-primary bg-primary/5 shadow-lg"
                                : "border-border/50 hover:border-primary/30"
                            }`}
                          >
                            {Icon && (
                              <Icon className="h-6 w-6 text-muted-foreground" />
                            )}
                            <span
                              id={`${option.value}-label`}
                              className="font-medium flex-1"
                            >
                              {option.label}
                            </span>
                            <RadioGroupItem
                              value={option.value}
                              id={option.value}
                              aria-labelledby={`${option.value}-label`}
                            />
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              )}

              {/* Step 2: Style */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    What visual style do you want?
                  </Label>
                  <RadioGroup
                    value={formData.style}
                    onValueChange={(value) => updateFormData("style", value)}
                    className="space-y-3"
                  >
                    {formOptions.style.map((option) => {
                      const Icon = iconMap[option.value];
                      return (
                        <div key={option.value} className="relative">
                          <Label
                            htmlFor={option.value}
                            className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:bg-muted/50 ${
                              formData.style === option.value
                                ? "border-primary bg-primary/5 shadow-lg"
                                : "border-border/50 hover:border-primary/30"
                            }`}
                          >
                            {Icon && (
                              <Icon className="h-6 w-6 text-muted-foreground" />
                            )}
                            <span
                              id={`${option.value}-label`}
                              className="font-medium flex-1"
                            >
                              {option.label}
                            </span>
                            <RadioGroupItem
                              value={option.value}
                              id={option.value}
                              aria-labelledby={`${option.value}-label`}
                            />
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              )}

              {/* Step 3: Mood */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    What mood should the thumbnail convey?
                  </Label>
                  <RadioGroup
                    value={formData.mood}
                    onValueChange={(value) => updateFormData("mood", value)}
                    className="space-y-3"
                  >
                    {formOptions.mood.map((option) => {
                      const Icon = iconMap[option.value];
                      return (
                        <div key={option.value} className="relative">
                          <Label
                            htmlFor={option.value}
                            className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:bg-muted/50 ${
                              formData.mood === option.value
                                ? "border-primary bg-primary/5 shadow-lg"
                                : "border-border/50 hover:border-primary/30"
                            }`}
                          >
                            {Icon && (
                              <Icon className="h-6 w-6 text-muted-foreground" />
                            )}
                            <span
                              id={`${option.value}-label`}
                              className="font-medium flex-1"
                            >
                              {option.label}
                            </span>
                            <RadioGroupItem
                              value={option.value}
                              id={option.value}
                              aria-labelledby={`${option.value}-label`}
                            />
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              )}

              {/* Step 4: Photo Placement */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    Where should your uploaded image appear?
                  </Label>
                  <RadioGroup
                    value={formData.photoPlacement}
                    onValueChange={(value) =>
                      updateFormData("photoPlacement", value)
                    }
                    className="space-y-3"
                  >
                    {formOptions.photoPlacement.map((option) => {
                      const Icon = iconMap[option.value];
                      return (
                        <div key={option.value} className="relative">
                          <Label
                            htmlFor={option.value}
                            className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:bg-muted/50 ${
                              formData.photoPlacement === option.value
                                ? "border-primary bg-primary/5 shadow-lg"
                                : "border-border/50 hover:border-primary/30"
                            }`}
                          >
                            {Icon && (
                              <Icon className="h-6 w-6 text-muted-foreground" />
                            )}
                            <span
                              id={`${option.value}-label`}
                              className="font-medium flex-1"
                            >
                              {option.label}
                            </span>
                            <RadioGroupItem
                              value={option.value}
                              id={option.value}
                              aria-labelledby={`${option.value}-label`}
                            />
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              )}

              {/* Step 5: Orientation */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    What aspect ratio/orientation?
                  </Label>
                  <RadioGroup
                    value={formData.orientation}
                    onValueChange={(value) =>
                      updateFormData("orientation", value)
                    }
                    className="space-y-3"
                  >
                    {formOptions.orientation
                      .filter((option) =>
                        ["horizontal", "vertical", "square"].includes(
                          option.value
                        )
                      )
                      .map((option) => {
                        const Icon = iconMap[option.value];
                        return (
                          <div key={option.value} className="relative">
                            <Label
                              htmlFor={option.value}
                              className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:bg-muted/50 ${
                                formData.orientation === option.value
                                  ? "border-primary bg-primary/5 shadow-lg"
                                  : "border-border/50 hover:border-primary/30"
                              }`}
                            >
                              {Icon && (
                                <Icon className="h-6 w-6 text-muted-foreground" />
                              )}
                              <span
                                id={`${option.value}-label`}
                                className="font-medium flex-1"
                              >
                                {option.label}
                              </span>
                              <RadioGroupItem
                                value={option.value}
                                id={option.value}
                                aria-labelledby={`${option.value}-label`}
                              />
                            </Label>
                          </div>
                        );
                      })}
                  </RadioGroup>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleFinalGenerate}
                    disabled={!isStepValid(currentStep) || isGenerating}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <WandSparkles className="h-4 w-4" />
                    {isGenerating ? "Generating..." : "Generate Thumbnail"}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
};

export default FormModeLayout;
