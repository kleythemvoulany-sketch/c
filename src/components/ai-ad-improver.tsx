"use client";

import { useState, useEffect, useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
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
import { SubmitButton } from "./ai-ad-improver-submit-button";

const initialState = {
  improvedDescription: "",
  reasoning: "",
  error: "",
};

type AiAdImproverProps = {
  currentDescription: string;
  onDescriptionChange: (newDescription: string) => void;
};

export function AiAdImprover({ currentDescription, onDescriptionChange }: AiAdImproverProps) {
  const [state, formAction] = useActionState(
    improveAdDescriptionAction,
    initialState
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Open the dialog only when we get a valid response from the server action
    if (state.improvedDescription) {
      setIsDialogOpen(true);
    }
    // Also open dialog for errors
    if(state.error) {
      setIsDialogOpen(true);
    }
  }, [state.improvedDescription, state.error]);


  const handleUseSuggestion = () => {
    if (state.improvedDescription) {
      onDescriptionChange(state.improvedDescription);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="description">الوصف</Label>
        <SubmitButton
            formAction={formAction}
            currentDescription={currentDescription}
        />
      </div>
      <Textarea
        id="description"
        name="adDescription"
        placeholder="مثال: سيارة نظيفة جدًا، بحالة ممتازة من الداخل والخارج، جاهزة للاستعمال..."
        rows={6}
        value={currentDescription}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl" dir="rtl" aria-labelledby="ai-improver-dialog-title">
          <DialogHeader>
            <DialogTitle id="ai-improver-dialog-title" className="font-headline flex items-center gap-2">
              <Wand2 /> اقتراحات التحسين
            </DialogTitle>
            <DialogDescription>
              {state.error ? 'حدث خطأ أثناء التحسين.' : 'قام الذكاء الاصطناعي بتحليل وصفك واقتراح نسخة محسنة.'}
            </DialogDescription>
          </DialogHeader>

          {state.error ? (
             <div className="text-destructive p-4 bg-destructive/10 rounded-md">
                {state.error}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[60vh] overflow-y-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">الوصف المقترح</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/90 whitespace-pre-line">
                    {state.improvedDescription}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg">سبب التحسين</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/90 whitespace-pre-line">
                    {state.reasoning}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إغلاق
            </Button>
            {!state.error && (
               <Button onClick={handleUseSuggestion} className="bg-accent text-accent-foreground hover:bg-accent/90">
                 استخدام هذا الوصف
               </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
