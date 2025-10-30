"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2 } from "lucide-react";

export function SubmitButton({
  formAction,
  currentDescription,
}: {
  formAction: (payload: FormData) => void;
  currentDescription: string;
}) {
  const { pending } = useFormStatus();

  const handleClick = () => {
    const formData = new FormData();
    formData.append("adDescription", currentDescription);
    formAction(formData);
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={pending || currentDescription.length < 10}
      className="bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      {pending ? (
        <>
          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
          جاري التحسين...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          تحسين الوصف بالذكاء الاصطناعي
        </>
      )}
    </Button>
  );
}
