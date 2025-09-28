"use client"

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "@/components/ui/separator";
import { Entry } from "@/lib/types";
import { languages } from "@/lib/types";
import { useState, useEffect } from "react";
import { ScrollArea } from "../ui/scroll-area";

export function EntryCard({ entry }: { entry: Entry }) {
  const [open, setOpen] = useState(false);
  const [senses, setSenses] = useState<{ id: string, entry_id: string, value: string }[]>([]);
  const [examples, setExamples] = useState<{ id: string, entry_id: string, value: string, translation: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!open) return;
    if(senses.length > 0 && examples.length > 0) return;
    const c = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const req = await fetch(`/api/entry-data?id=${entry.id}`);
        const res = await req.json();
        setSenses(res.data.senses);
        setExamples(res.data.examples);
      } catch (err: any) {
        if (err?.name !== "AbortError") console.error(err?.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
    return () => c.abort();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-[80px]">{entry.value}</div>
      </DialogTrigger>
        <ScrollArea>
      <DialogContent className="sm:max-w-[425px]">

          <DialogHeader>
            <DialogTitle>{entry.value}</DialogTitle>
            <DialogDescription>
              <Badge variant="secondary" className="text-xs">
                {languages.find(l => l.value === entry.language)?.label}
              </Badge>
            </DialogDescription>
          </DialogHeader>
          <Card>
            <CardContent className="space-y-4">
              <section>
                <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Senses
                </h3>
                <ol className="space-y-2">
                  {senses.map((s, i) => (
                    <li
                      key={`${i}-${s.entry_id}`}
                      className="rounded-md bg-muted/40 px-3 py-2 text-sm"
                    >
                      <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded bg-muted text-[11px]">
                        {i + 1}
                      </span>
                      <span className="align-middle">{s.value}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <Separator />

              <section>
                <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Usage examples
                </h3>
                {examples.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No examples yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {examples.map((ex, i) => (
                      <li key={i} className="text-sm">
                        <p className="leading-snug">{ex.value}</p>
                        <p className="mt-1 text-muted-foreground leading-snug">
                          {ex.translation}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </CardContent>
          </Card>
      </DialogContent>
        </ScrollArea>
    </Dialog>
  )
}