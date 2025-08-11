import OpenAI from "openai";

export function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY が設定されていません");
  }
  const client = new OpenAI({ apiKey });
  return client;
}

export const OPENAI_MODEL = "gpt-4o-mini";