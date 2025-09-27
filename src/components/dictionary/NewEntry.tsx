import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { languages, type Chat } from "@/lib/types";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

export function NewEntry({onRefresh}:{onRefresh:()=>void}) {
  const [input, setInput] = useState<string>('');
  const [language, setLanguage] = useState<string>(languages[0].value);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = () => {
    setInput('');
    setLanguage(languages[0].value);
    setOpen(false);
  }

  const handleNewEntry = async() => {
    setIsLoading(true);
    const req = await fetch('/api/new-entry', {
      method: "POST",
      body: JSON.stringify({language: language, entry: input}),
      headers: {
        "Content-Type": "application/json"
      },
    });

    setIsLoading(false);
    const res = await req.json();
    if(!res.ok) {
      alert(res.message);
    }
    refresh();
    onRefresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Add Entry</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Entry</DialogTitle>
          <DialogDescription>
            Write the desired entry, then select the language
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 my-3">
          <div className="grid gap-3">
            <Label htmlFor="entry">Entry</Label>
            <Input id="entry" name="entry" placeholder="..." value={input} onChange={(e) => setInput(e.target.value)}/>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="language">Language</Label>
            <Select key="lang-select" name="language" value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pick a language"/>
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => {
                  return (
                    <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleNewEntry} disabled={isLoading}>Save entry</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}