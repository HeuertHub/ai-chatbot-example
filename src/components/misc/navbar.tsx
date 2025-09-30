'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, BookA, Dumbbell, Briefcase, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { DictionaryTable } from '../dictionary/DictionaryTable';
import { languages, PracticeSession, SessionExercise, type Entry } from "@/lib/types";
import { LessonRunner } from "@/components/practice/LessonRunner";
import { ScrollArea } from '../ui/scroll-area';
import { sleep } from '@/lib/sleep';

// const QUESTIONS: LessonQuestion[] = [
//   {
//     id: "q1",
//     type: "fill-in-blank",
//     prompt: "I ___ apples every day.",
//     options: ["eat", "eats", "ate"],
//     correctOptionIndex: 0,
//     explanation: "Present simple with 'I' uses the base form: 'I eat'.",
//   },
//   {
//     id: "q2",
//     type: "word-meaning",
//     prompt: "rápido",
//     options: ["slow", "fast", "quiet"],
//     correctOptionIndex: 1,
//     explanation: "‘Rápido’ means ‘fast/quick’.",
//     exampleSentence: "É um carro muito rápido.",
//   },
//   // ...add ~10 total
// ];

export default function NavBar() {
  const { theme, systemTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [practiceDialogOpen, setPracticeDialogOpen] = useState(false);
  const [practiceSessionLoaded, setPracticeSessionLoaded] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [practiceSession, setPracticeSession] = useState<PracticeSession>({
    completed:false, 
    id: '',
    language: '',
    score: 0,
    timestamp: new Date().getTime()
  });
  const [sessionExercises, setSessionExercises] = useState<SessionExercise[]>([]);

  useEffect(() => setMounted(true), []);

  const current = theme === 'system' ? systemTheme : theme;
  const isDark = current === 'dark';

  const toggle = () => setTheme(isDark ? 'light' : 'dark');

  const loadEntries = async () => {
    const req = await fetch('/api/dictionary');
    const res = await req.json();

    setEntries(res.data);
  }

  const handleStartPractice = async () => {
    if(practiceDialogOpen) { setPracticeDialogOpen(false); return; }

    const req = await fetch('/api/provide-practice');
    const res = await req.json();

    if(!res.ok) {
      alert(res.message);
    } else {
      setPracticeSession(res.data.session);
      setSessionExercises(res.data.exercises);

      setPracticeSessionLoaded(true);
      setPracticeDialogOpen(true);
    }
  }

  const handleFinishSession = async({ session, questions }:{session:PracticeSession, questions: SessionExercise[]}) => {
    const req = await fetch('/api/finish-practice',{
      method: "POST",
      body: JSON.stringify({session, questions}),
      headers: {'Content-Type': 'application/json'}
    });
    const res = await req.json();

    if(!res.ok) {
      alert(res.message);
    } else {
      await sleep(3000);
      setPracticeSession({
        completed:false, 
        id: '',
        language: '',
        score: 0,
        timestamp: new Date().getTime()
      });
      setSessionExercises([]);
      setPracticeSessionLoaded(false);
      setPracticeDialogOpen(false);
    }
  }

  if (!mounted) {
    return <></>;
  }

  return (
    <TooltipProvider>
      <div className="fixed top-1/2 right-6 z-50 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-md border px-2 py-4 flex flex-col space-y-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  onClick={loadEntries}
                  size="icon"
                  variant="ghost"
                  className="transition-transform hover:scale-110"
                >
                  <BookA className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="">
                <div className="mx-auto w-full max-w-7xl overflow-y-scroll">
                  <DrawerHeader>
                    <DrawerTitle>
                      Saved Words & Expressions
                    </DrawerTitle>
                    <DrawerDescription>
                      Search through the words and expressions you saved
                    </DrawerDescription>
                  </DrawerHeader>
                  <DictionaryTable entries={entries} onRefresh={loadEntries} />
                  <DrawerFooter>
                    <p className="text-sm text-muted-foreground text-center">Click anywhere outside to close</p>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </TooltipTrigger>
          <TooltipContent side="right">Saved Words & Expressions</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Dialog open={practiceDialogOpen} onOpenChange={handleStartPractice}>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="transition-transform hover:scale-110"
                >
                  <Dumbbell className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent key="practice-dialog">
                  <DialogHeader>
                    <DialogTitle>
                      Practice session
                    </DialogTitle>
                  </DialogHeader>
                  {practiceSessionLoaded ? 
                  <div className="p-6 flex justify-center">
                    <LessonRunner
                      title={languages.find(l => l.value === practiceSession?.language)?.label|| 'NA'}
                      description="Choose the correct answer."
                      questions={sessionExercises}
                      session={practiceSession}
                      onFinish={handleFinishSession}
                      /> 
                  </div>
                    : ''}
              </DialogContent>
            </Dialog>
          </TooltipTrigger>
          <TooltipContent side="right">Practice</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="transition-transform hover:scale-110"
              onClick={toggle}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Toggle Theme</TooltipContent>
        </Tooltip>

      </div>
    </TooltipProvider>
  );
}

