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
  if (!inputs) {
    throw new AppError("Please Provide Input", 400);
  }

  // Parse each JSON string in the `inputs` array to transform it into an array of objects
  const transformedMessages = inputs.map((input: any) => JSON.parse(input));
  console.log(transformedMessages);

  const response = await executeGpt(transformedMessages);

  if (typeof response === "string") {
    return controllerReturn(response, req, res);
  }

  const data = response.choices[0]?.message?.content;

  controllerReturn(data, req, res);
};
