"use server"

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
import { getSenses, getExamples } from "@/lib/db";

export async function EntryCard({entry}:{entry:Entry}) {
  const senses:string[] = await getSenses({entry_id: entry.id});
  const examples:{value:string, translation:string}[] = await getExamples({entry_id: entry.id});

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <div className="w-[80px]">{entry.value}</div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{entry.value}</DialogTitle>
            <DialogDescription>
              <Badge variant="secondary" className="text-xs">
                {entry.language}
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
                      key={`${i}-${s}`}
                      className="rounded-md bg-muted/40 px-3 py-2 text-sm"
                    >
                      <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded bg-muted text-[11px]">
                        {i + 1}
                      </span>
                      <span className="align-middle">{s}</span>
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
      </form>
    </Dialog>
  )
}