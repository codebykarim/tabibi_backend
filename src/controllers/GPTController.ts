import { Request, Response } from "express";
import AppError from "../errors/AppError";
import controllerReturn from "../utils/successReturn";
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

  // Set header for streaming response
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");

  let buffer = ""; // Buffer for Arabic text
  const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text); // Detect Arabic

  const cleanText = (text: string) =>
    text.replace(/\./g, "").replace(/\n/g, " "); // Remove dots and replace newlines

  for await (const part of response) {
    let content = part.choices[0]?.delta?.content;

    if (content) {
      // Clean content before processing
      content = cleanText(content);

      if (isArabic(content)) {
        buffer += content;
        if (
          buffer.endsWith(" ") ||
          buffer.endsWith("\n") ||
          buffer.length > 10
        ) {
          res.write(`data: ${JSON.stringify({ content: buffer })}\n\n`);
          console.log("first part", buffer);
          buffer = ""; // Reset buffer
        }
      } else {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
  }

  if (buffer) {
    res.write(`data: ${JSON.stringify({ content: buffer.trim() })}\n\n`);
  }

  res.end();
};
