"use client";
/*
  form tạo ra 1 channel
*/
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import qs from "query-string";
import { useEffect, useState } from "react";

// validate form input
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Tên kênh không được bỏ trống",
  }),
});

export const EditChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "editChannel";
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();

  const { channel, server } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (channel) {
      form.setValue("name", channel.name);
    }
  }, [channel, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: params?.serverId,
        },
      });
      const result = await axios.put(url, values);
      if (result.data.status === false) {
        alert(result.data.message);
      } else {
        router.refresh();
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };


  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        {/* header modal */}
        <DialogHeader className="pt-8 px-6">
          {/* title modal */}
          <DialogTitle className="text-2xl text-center font-bold">
            Cập nhập kênh
          </DialogTitle>
        </DialogHeader>
        {/* header modal */}

        {/* form modal */}
        <Form {...form}>
          {/* Tạo form => gọi hàm onSubmit */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              {/* servername input */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Tên kênh
                    </FormLabel>

                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visiable:ring-0
                       text-black focus-visible:ring-offset-0"
                        placeholder="Nhập tên kênh"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* footer modal */}
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button type="submit" variant="primary" disabled={isLoading}>
                Cập nhập
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
