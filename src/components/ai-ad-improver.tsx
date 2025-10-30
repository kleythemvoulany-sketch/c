"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2 } from "lucide-react";
import { improveAdDescriptionAction } from "@/app/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const initialState = {
  improvedDescription: "",
  reasoning: "",
  error: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
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

export function AiAdImprover() {
  const [state, formAction] = useFormState(
    improveAdDescriptionAction,
    initialState
  );
  const [description, setDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleFormAction = (formData: FormData) => {
    formAction(formData);
    setShowResult(true);
    setIsDialogOpen(true);
  };
  
  const handleUseSuggestion = () => {
    if (state.improvedDescription) {
        setDescription(state.improvedDescription);
    }
    setIsDialogOpen(false);
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="description">الوصف</Label>
      <Textarea
        id="description"
        name="adDescription"
        placeholder="مثال: سيارة نظيفة جدًا، بحالة ممتازة من الداخل والخارج، جاهزة للاستعمال..."
        rows={6}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <form action={handleFormAction} className="pt-2">
        <input type="hidden" name="adDescription" value={description} />
        <SubmitButton />
      </form>

      {showResult && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl" dir="rtl" aria-labelledby="ai-improver-dialog-title">
            <DialogHeader>
              <DialogTitle id="ai-improver-dialog-title" className="font-headline flex items-center gap-2">
                <Wand2 /> اقتراحات التحسين
              </DialogTitle>
              <DialogDescription>
                قام الذكاء الاصطناعي بتحليل وصفك واقتراح نسخة محسنة.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[60vh] overflow-y-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">الوصف المقترح</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-foreground/90 whitespace-pre-line">{state.improvedDescription}</p>
                    </CardContent>
                </Card>
                <Card className="bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-lg">سبب التحسين</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-foreground/90 whitespace-pre-line">{state.reasoning}</p>
                    </CardContent>
                </Card>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                إغلاق
              </Button>
              <Button onClick={handleUseSuggestion} className="bg-accent text-accent-foreground hover:bg-accent/90">
                استخدام هذا الوصف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
