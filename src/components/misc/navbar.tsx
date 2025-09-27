'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, BookA, Dumbbell, Briefcase, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
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
import { type Entry } from "@/lib/types";

export default function NavBar() {
  const { theme, systemTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => setMounted(true), []);

  const current = theme === 'system' ? systemTheme : theme;
  const isDark = current === 'dark';

  const toggle = () => setTheme(isDark ? 'light' : 'dark');

  const loadEntries = async() => {
    const req = await fetch('/api/dictionary');
    const res = await req.json();

    setEntries(res);
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
              <DrawerContent>
                <div className="min-h-3/4 mx-auto w-full max-w-7xl">
                  <DrawerHeader>
                    <DrawerTitle>
                      Saved Words & Expressions
                    </DrawerTitle>
                    <DrawerDescription>
                      Search through the words and expressions you saved
                    </DrawerDescription>
                  </DrawerHeader>
                  <DictionaryTable entries={entries} onRefresh={loadEntries}/>
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
            <Button
              size="icon"
              variant="ghost"
              className="transition-transform hover:scale-110"
            >
              <Dumbbell className="h-5 w-5" />
            </Button>
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

