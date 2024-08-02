'use client';
/*
  form tạo ra 1 server
*/
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { FileUpload } from "@/components/ui/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect } from "react";
// validate form input
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Tên máy chủ không được bỏ trống",
  }),
  imageUrl: z.string().min(1, {
    message: "Không được để trống ảnh",
  }),
});
export const EditServerModal = () => {
  const { isOpen, onClose, type,data } = useModal();
  const isModalOpen = isOpen && type === "editServer"
  const router = useRouter(); // khởi tạo router
  const {server}=data

  // Tạo ra 1 form dữ liệu sử dụng react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  // set lại dữ liệu
  useEffect(()=>{
    if(server)
    {
        form.setValue("name",server.name)
        form.setValue("imageUrl",server.imageUrl)
    }
  },[server,form])

  // thao tác tương tác form
  const isLoading = form.formState.isSubmitSuccessful;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await axios.put(`/api/servers/${server?.id}`, values);
      if (result.data.status == false) {
        alert(result.data.message);
      } else {
        onClose()
        form.reset();
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = ()=>{
    form.reset()
    onClose()
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        {/* header modal */}
        <DialogHeader className="pt-8 px-6">
          {/* title modal */}
          <DialogTitle className="text-2xl text-center font-bold">
            Cập nhập máy chủ
          </DialogTitle>
          {/* thông tin chi tiết của modal */}
          
        </DialogHeader>
        {/* header modal */}

        {/* form modal */}
        <Form {...form}>
          {/* Tạo form => gọi hàm onSubmit */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              {/* image upload */}
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Ảnh máy chủ
                      </FormLabel>

                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* servername input */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Tên máy chủ
                    </FormLabel>

                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visiable:ring-0
                       text-black focus-visible:ring-offset-0"
                        placeholder="Nhập tên máy chủ"
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
              <Button variant="primary" disabled={isLoading}>
                Cập nhập máy chủ
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
