"use client";

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

interface ServerSearchProps {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}

export const ServerSearch = ({ data }: ServerSearchProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          setOpen(true);
        }}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
      >
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          Tìm kiếm
        </p>

        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded-none border bg-muted px-1.5 font-momo text-[10px] font-medium text-muted-foreground ml-auto">
          <span className="text-xs">ctrl+F</span>
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">
          Enter your search query to find channels or members.
        </DialogDescription>
        <CommandInput placeholder="Nhập nội dung tìm kiếm" />
        <CommandList>
          <CommandEmpty>
            Chúng tôi đã tìm kiếm rất nhiều <br />
            Xui xẻo là chúng tôi không tìm thấy gì.
          </CommandEmpty>

          {data.map(({ label, type, data }) => {
            if (!data?.length) return null;
            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ id, icon, name }) => (
                  <div className="flex items-center w-full cursor-pointer mb-2 p-2 text-sm hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition "
                    onClick={() => {}}
                    key={id}
                  >
                  <CommandItem key={id} className="sr-only"></CommandItem>
                    {icon}
                    <span>{name}</span>
                  </div>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </div>
  );
};
