"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import {} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const DeleteServerModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const { server } = data;

  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === "deleteServer";
  const router = useRouter();
  const deleteServer = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/servers/${server?.id}`);
      onClose();
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-white text-black p-0 overflow-hidden"
        aria-describedby=""
      >
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Rời khỏi máy chủ
          </DialogTitle>
        </DialogHeader>
        <div className="m-2">
          <DialogDescription className="text-center text-zinc-500">
            Bạn muốn xóa máy chủ ?{" "}
            <span className="font-semibold text-rose-500">{server?.name}</span>
          </DialogDescription>
          <DialogFooter className="bg-gray-100 px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <Button disabled={isLoading} variant="ghost" onClick={() => {onClose()}}>
                Hủy
              </Button>

              <Button disabled={isLoading} variant="primary" onClick={() => {deleteServer()}}>
                Xác nhận
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
