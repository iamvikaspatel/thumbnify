import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { connectToDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { input, formData } = body;
    const prompt = `
    Rewrite the following into a concise, detailed prompt (under 100 words) for generating a professional YouTube thumbnail image:
    
    User input: "${input}"

    Details:
    - Video type: ${formData.videoType}
    - Style: ${formData.style}
    - Mood: ${formData.mood}
    - Photo placement: ${formData.photoPlacement}
    - Orientation: ${formData.orientation}
    - A user photo is provided (remove its background and use it in the design).
    - Match the orientation ratio of the input image.
    - Explicitly mention the final size in pixels (e.g., 1280x720 for horizontal, 1080x1920 for vertical).

    Make the rewritten prompt clear, visually descriptive, and optimized for thumbnail generation.
`;

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    });
    return new Response(JSON.stringify({ rewrittenPrompt: text }), {
      status: 200,
    });
  } catch (error) {
    console.error("Rewrite prompt error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
