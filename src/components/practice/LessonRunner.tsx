"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import { PracticeSession, SessionExercise } from "@/lib/types";
import { Volume2 } from "lucide-react";
import { speak, stop, getVoicesByLang, TTSVoice } from "@/lib/tts";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

export type LessonRunnerProps = {
  title?: string;
  description?: string;
  questions: SessionExercise[];
  session: PracticeSession;
  shuffleOptions?: boolean; 
  onFinish?: (result: { session:PracticeSession, questions:SessionExercise[] }) => void;
  className?: string;
};

type Choice = { label: string; isCorrect: boolean };

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function LessonRunner({
  title = "Lesson",
  description = "Pick the correct answer for each question.",
  questions,
  session,
  shuffleOptions = true,
  onFinish,
  className,
}: LessonRunnerProps) {
  const [index, setIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [lockedIn, setLockedIn] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [voices, setVoices] = React.useState<TTSVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = React.useState<string | null>(null);

  React.useEffect(() => {
    getVoicesByLang(session.language).then((list) => {
      setVoices(list);
      if (list.length) setSelectedVoice(list[0].voiceURI);
    });
  }, []);

  const prepared = React.useMemo(() => {
    return questions?.map((q) => {
      const base: Choice[] = q.options.map((opt, i) => ({
        label: opt,
        isCorrect: i === 0,
      }));
      return shuffleOptions ? shuffled(base) : base;
    });
  }, [questions, shuffleOptions]);

  const current = questions[index];
  const choices = prepared[index];
  const progress = Math.round(((index) / questions.length) * 100);
  const done = index >= questions.length;

  function handleLock() {
    if (selected == null) return;
    setLockedIn(true);
    const c = choices.find((c) => c.label === selected);
    current.completed = true;
    if (c?.isCorrect) {
      setScore((s) => s + 1);
      current.correct = true;
    } else {
      current.correct = false;
    }
  }

  function handleNext() {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setSelected(null);
      setLockedIn(false);
    } else {
      const total = questions.length;
      const correct = score;
      const accuracy = total ? Math.round((correct / total) * 100) : 0;
      session.score = accuracy;
      session.completed = true;
      onFinish?.({ session, questions });
      setIndex((i) => i + 1);
    }
  }

  const onPlay = (content: string) => {
    if (selectedVoice) {
      speak(content, selectedVoice);
    }
  }

  if (!questions?.length) {
    return (
      <Card className={cn("w-full max-w-2xl", className)}>
        <CardHeader>
          <CardTitle>No entries in the dictionary</CardTitle>
          <CardDescription>Add some entries to start a lesson.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (done) {
    const total = questions.length;
    const accuracy = total ? Math.round((score / total) * 100) : 0;
    return (
      <Card className={cn("w-full max-w-2xl", className)}>
        <CardHeader>
          <CardTitle>{title} — Finished</CardTitle>
          <CardDescription>You completed {total} questions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-3xl font-semibold">{score}/{total}</div>
            <Badge variant={accuracy >= 80 ? "default" : accuracy >= 50 ? "secondary" : "outline"}>
              {accuracy}% correct
            </Badge>
          </div>
          <Progress value={100} />
          <Alert>
            <AlertTitle>Great job!</AlertTitle>
            <AlertDescription>
              Lesson finished. Keep practicing to improve your accuracy.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const isCorrect = lockedIn
    ? choices.find((c) => c.label === selected)?.isCorrect === true
    : null;

  return (
    <Card className={cn("w-full max-w-2xl", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="outline">
            Q{index + 1}/{questions.length}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Voices</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Voices</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={selectedVoice || undefined} onValueChange={setSelectedVoice}>
                {voices.map((voice) => {
                  return (
                    <DropdownMenuRadioItem key={voice.voiceURI} value={voice.voiceURI}>{voice.name}</DropdownMenuRadioItem>
                  )
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-4">
          <Progress value={progress} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {current.type === "fill-in-blank" ? (
          <QuestionPromptFill prompt={current.prompt} onPlay={onPlay} />
        ) : (
          <QuestionPromptWord word={current.prompt} onPlay={onPlay} />
        )}

        <Separator />

        <div className="grid gap-2">
          {choices.map((choice) => {
            const active = selected === choice.label;
            const showCorrect = lockedIn && choice.isCorrect;
            const showIncorrect = lockedIn && active && !choice.isCorrect;

            return (
              <Button
                key={choice.label}
                variant={showCorrect ? "default" : showIncorrect ? "destructive" : active ? "secondary" : "outline"}
                className="justify-start h-auto py-3"
                disabled={lockedIn}
                onClick={() => {setSelected(choice.label); if(current.type === 'fill-in-blank'){onPlay(choice.label);}}}
              >
                <span className="mr-2 inline-flex items-center">
                  {showCorrect ? <CheckCircle2 className="size-4" /> : showIncorrect ? <XCircle className="size-4" /> : null}
                </span>
                {choice.label}
              </Button>
            );
          })}
        </div>

        {lockedIn && (
          <div className="mt-2">
            {isCorrect ? (
              <Alert>
                <AlertTitle>Correct!</AlertTitle>
                <AlertDescription className="flex flex-row">
                  {current.type !== 'fill-in-blank' ? <Volume2 className="h-4 w-4 mr-1 cursor-pointer" onClick={() => onPlay(current.explanation)}/> : ''}
                  {current.explanation ?? "Nice work."}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertTitle>Not quite.</AlertTitle>
                <AlertDescription>
                  {current.explanation
                    ? current.explanation
                    : `The correct answer is "${choices.find((c) => c.isCorrect)?.label}".`}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 justify-end">
        {!lockedIn ? (
          <Button disabled={selected == null} onClick={handleLock}>
            Check
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {index + 1 === questions.length ? "Finish" : "Next"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function QuestionPromptFill({ prompt, onPlay }: { prompt: string, onPlay: (content:string)=>void }) {
  // Optional: visually mark the blank with an underscore if user uses something like "___"
  const parts = React.useMemo(() => {
    // split on runs of underscores
    const m = prompt.split(/(_{3,})/g);
    return m.length > 1 ? m : [prompt];
  }, [prompt]);
  const speakablePrompt = prompt.replaceAll('_', ' ');

  if (parts.length === 1) {
    return (
      <div className="text-lg flex flex-row items-center">
        <Volume2 className="h-4 w-4 mr-3 cursor-pointer" onClick={() => onPlay(speakablePrompt)}/>{prompt}
      </div>
    );
  }

  return (
    <div className="text-lg leading-relaxed flex flex-row items-center">
      <Volume2 className="h-4 w-4 mr-3 cursor-pointer" onClick={() => onPlay(speakablePrompt)}/>
      {parts.map((p, i) =>
        /_{3,}/.test(p) ? (
          <span key={i} className="inline-block min-w-24 border-b border-dashed align-baseline">&nbsp;</span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </div>
  );
}

function QuestionPromptWord({ word, example, onPlay }: { word: string; example?: string, onPlay: (content:string)=>void }) {
  return (
    <div className="space-y-1">
      <div className="text-xl font-semibold flex flex-row items-center"><Volume2 className="h-4 w-4 mr-3 cursor-pointer" onClick={() => onPlay(word)}/>{word}</div>
      {example ? <div className="text-muted-foreground text-sm">“{example}”</div> : null}
    </div>
  );
}