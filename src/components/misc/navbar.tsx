'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
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
import { BookA, Dumbbell, Briefcase, Mail } from "lucide-react";
import { DictionaryTable } from '../dictionary/DictionaryTable';

export default function NavBar() {
  const { theme, systemTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = theme === 'system' ? systemTheme : theme;
  const isDark = current === 'dark';

  const toggle = () => setTheme(isDark ? 'light' : 'dark');

  if (!mounted) {
    return <button aria-label="Toggle theme" style={fabStyle} />;
  }

  return (
    <TooltipProvider>
      <div className="fixed top-1/2 right-6 z-50 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-md border px-2 py-4 flex flex-col space-y-3">
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="transition-transform hover:scale-110"
                >
                  <BookA className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>
                      Saved Words & Expressions
                    </DrawerTitle>
                    <DrawerDescription>
                      Search through the words and expressions you saved
                    </DrawerDescription>
                  </DrawerHeader>
                  <DictionaryTable />
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

const fabStyle: React.CSSProperties = {
  position: 'fixed',
  left: '95%',
  transform: 'translateX(-50%)',
  bottom: '3%',
  width: 56,
  height: 56,
  borderRadius: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--fab-bg, rgba(0,0,0,0.75))',
  color: 'white',
  border: 'none',
  boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
  cursor: 'pointer',
  zIndex: 50,
};
/* <button
      aria-label="Toggle theme"
      onClick={toggle}
      style={fabStyle}
    >
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </button> */