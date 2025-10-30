"use server";

import { improveAdDescription } from "@/ai/flows/ai-powered-ad-improvement";
import { z } from "zod";

const schema = z.object({
  adDescription: z.string().min(10, "يجب أن يكون الوصف 10 أحرف على الأقل."),
});

type State = {
  improvedDescription: string;
  reasoning: string;
  error: string;
};

export async function improveAdDescriptionAction(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = schema.safeParse({
    adDescription: formData.get("adDescription"),
  });

  if (!validatedFields.success) {
    return {
      improvedDescription: "",
      reasoning: "",
      error: validatedFields.error.flatten().fieldErrors.adDescription?.[0] ?? "An unknown error occurred.",
    };
  }

  try {
    const result = await improveAdDescription({
      adDescription: validatedFields.data.adDescription,
    });

    return {
      improvedDescription: result.improvedDescription,
      reasoning: result.reasoning,
      error: "",
    };
  } catch (error) {
    console.error(error);
    return {
      improvedDescription: "",
      reasoning: "",
      error: "فشل في تحسين الوصف. الرجاء المحاولة مرة أخرى.",
    };
  }
}
