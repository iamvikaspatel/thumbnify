import mongoose, { Schema, Document, Model } from "mongoose";

// Generation status types
export type GenerationStatus = "pending" | "completed" | "failed";

// Generation settings interface
export interface GenerationSettings {
  videoType?: string;
  style?: string;
  mood?: string;
  photoPlacement?: string;
  orientation?: string;
  customAspectRatio?: string;
}

// Generation interface
export interface IGeneration extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  prompt: string;
  rewrittenPrompt?: string;
  originalImageUrl?: string;
  generatedImageUrl?: string;
  settings: GenerationSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Generation Schema
const GenerationSchema = new Schema<IGeneration>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    rewrittenPrompt: {
      type: String,
      trim: true,
      maxlength: 3000,
    },
    originalImageUrl: {
      type: String,
    },
    generatedImageUrl: {
      type: String,
    },
    settings: {
      videoType: {
        type: String,
        trim: true,
      },
      style: {
        type: String,
        trim: true,
      },
      mood: {
        type: String,
        trim: true,
      },
      photoPlacement: {
        type: String,
        trim: true,
      },
      orientation: {
        type: String,
        trim: true,
      },
      customAspectRatio: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
    collection: "generations",
  }
);

// Prevent re-compilation during development
export const Generation: Model<IGeneration> = 
  mongoose.models.Generation || mongoose.model<IGeneration>("Generation", GenerationSchema);

export default Generation;
