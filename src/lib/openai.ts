import { OpenAI } from "openai";

export const openai = new OpenAI({
  // organization: "org-yourorg", // replace with your organization
  apiKey: process.env.OPENAI_API_KEY!,
  dangerouslyAllowBrowser: true,
});
