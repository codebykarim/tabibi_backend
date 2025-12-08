import { Request, Response } from "express";
import AppError from "../errors/AppError";
import { executeGpt } from "../utils/gpt-script";

export const sendGPTResponse = async (
  req: Request,
  res: Response,
  body?: any
) => {
  const { inputs } = body ?? (req.body as { inputs?: string[] });

  if (!inputs || inputs.length === 0) {
    throw new AppError("Please Provide Input", 400);
  }

  const transformedMessages = inputs.map((input: any) => JSON.parse(input));

  const response = await executeGpt(transformedMessages);

  // Set headers for streaming response
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");

  let buffer = ""; // Buffer for Arabic text

  const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text); // Detect Arabic

  const cleanText = (text: string) =>
    text
      .replace(/[^\u0600-\u06FF\s]/g, "") // Remove non-Arabic characters, including English text, emojis, and markdown
      .replace(/[٠-٩]/g, "") // Remove Arabic numbers
      .replace(/\./g, "") // Remove dots
      .replace(/\n/g, " ") // Replace newlines with spaces
      .replace(/ال\s+/g, "ال"); // Fix certain Arabic word spacing issues

  for await (const part of response) {
    let content = part.choices[0]?.delta?.content;

    if (content) {
      // Clean content before processing
      content = cleanText(content);

      // Only process Arabic text
      if (isArabic(content)) {
        buffer += content;

        // If buffer reaches a suitable length or contains a space/newline, stream it
        if (
          buffer.endsWith(" ") ||
          buffer.endsWith("\n") ||
          buffer.length > 10
        ) {
          res.write(`data: ${JSON.stringify({ content: buffer })}\n\n`);
          console.log("Streaming part:", buffer);
          buffer = ""; // Reset buffer after streaming
        }
      }
    }
  }

  // If there’s remaining text in the buffer, send it as the final part
  if (buffer) {
    res.write(`data: ${JSON.stringify({ content: buffer.trim() })}\n\n`);
  }

  res.end();
};
