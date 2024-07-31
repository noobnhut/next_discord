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
import queryString from "query-string";

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const { channel, server } = data;


  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === "deleteChannel";
  const router = useRouter()
  const deleteChannel = async () => {
    try {
      setIsLoading(true);
      const url = queryString.stringifyUrl({
        url:`/api/channels/${channel?.id}`,
        query:{
            serverId:server?.id
        }
      })
      await axios.delete(url);
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
            Xóa kênh
          </DialogTitle>
        </DialogHeader>
        <div className="m-2">
          <DialogDescription className="text-center text-zinc-500">
            Bạn muốn xóa kênh này ?{" "}
            <span className="font-semibold text-rose-500">#{channel?.name}</span>.
            <br/>
            Dữ liệu của kênh sẽ mất hết sau khi xóa.
          </DialogDescription>
          <DialogFooter className="bg-gray-100 px-6 py-4 mt-2">
            <div className="flex items-center justify-between w-full">
              <Button disabled={isLoading} variant="ghost" onClick={() => {onClose()}}>
                Hủy
              </Button>

              <Button disabled={isLoading} variant="primary" onClick={() => {deleteChannel()}}>
                Xác nhận
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
