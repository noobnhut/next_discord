"use client";

import { Profile, Member, MemberRole } from "@prisma/client";
import { UserAvatar } from "../ui/user-avatar";
import { ActionTooltip } from "../ui/action-tooltip";
import {
  Edit,
  FileIcon,
  ShieldAlert,
  ShieldCheck,
  Trash,
  X,
} from "lucide-react";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { useModal } from "@/hooks/use-modal-store";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  currentMember: Member;
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  isUpdate: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATION: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-400" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-400" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatItem = ({
  id,
  content,
  member,
  currentMember,
  timestamp,
  fileUrl,
  deleted,
  isUpdate,
  socketQuery,
  socketUrl,
}: ChatItemProps) => {
  const FileType = fileUrl?.split(".").pop();
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModeration = currentMember.role === MemberRole.MODERATION;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModeration || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = FileType == "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  const [isEditing, setIsEditing] = useState(false);
  const{onOpen}=useModal()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key == "Escape" || event.keycode == 27) {
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isLoading = form.formState.isSubmitting
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
   
    try {
        const url = qs.stringifyUrl({
            url:`${socketUrl}/${id}`,
            query:socketQuery
        })
        await axios.patch(url,values)
        form.reset()
        setIsEditing(false)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content]);
  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-center w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profile.imageUrl} />
        </div>

        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer">
                {member.profile.name}
              </p>

              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden 
              border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}

          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF FILE
              </a>
            </div>
          )}

          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {content}
              {isUpdate && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (Đã chỉnh sửa)
                </span>
              )}
            </p>
          )}

          {!fileUrl && isEditing && (
            <Form {...form}>
              {/* Tạo form => gọi hàm onSubmit */}
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center w-full gap-x-2 pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="w-full relative">
                          <Input
                          disabled={isLoading}
                            className="p-2 bg-zinc-200/90 border-0 focus-visiable:ring-0
                   text-black focus-visible:ring-offset-0"
                            placeholder="Nhập tên kênh"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button size="sm" variant="primary">
                  Lưu lại
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Nhấn esc để hủy, enter để lưu
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div
          className="hidden group-hover:flex items-center gap-x-2 absolute 
        p-1 -top-2 right-5 bg-white dark:bg-zinc0800 border rounded-sm"
        >
          {canEditMessage && (
            <ActionTooltip label="Chỉnh sửa">
              <Edit
                onClick={() => {
                  setIsEditing(true);
                }}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 
                    hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          )}

          {canDeleteMessage && (
            <ActionTooltip label="Xóa">
              <Trash
                onClick={() => {
                  onOpen("deleteMessage",{apiUrl:`${socketUrl}/${id}`,query:socketQuery})
                }}
                className="cursor-pointer ml-auto w-4 h-4 text-rose-500 
                    hover:text-rose-600 dark:hover:text-rose-300 transition"
              />
            </ActionTooltip>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatItem;
