import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ChannelType, MemberRole } from "@prisma/client";
import { channel } from "diagnostics_channel";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

interface ServerSidebarProps {
  serverId: string;
}
const iconMap = {
  [ChannelType.TEXT]:<Hash className="mr-2 h-4 w-4"/>,
  [ChannelType.VIDEO]:<Video className="mr-2 h-4 w-4"/>,
  [ChannelType.AUDIO]:<Mic className="mr-2 h-4 w-4"/>
}

const roleIconMap = {
  [MemberRole.GUEST]:null,
  [MemberRole.MODERATION]:<ShieldCheck className="mr-2 h-4 w-4 text-indigo-500"/>,
  [MemberRole.ADMIN]:<ShieldAlert className="mr-2 h-4 w-4 text-rose-500"/>
}
export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({ 
    include:{
        channels:{
            orderBy:{
                createdAt:"asc"
            }
        },
        members:{
            include:{
                profile:true
            },
            orderBy:{
                role:"asc"
            }
        }
    },
    where: { id: serverId } });

  if (!server) {
    return redirect("/");
  }

  const textChannel = server?.channels.filter((channel)=>channel.type === ChannelType.TEXT)
  const audioChannel = server?.channels.filter((channel)=>channel.type === ChannelType.AUDIO)
  const videoChannel = server?.channels.filter((channel)=>channel.type === ChannelType.VIDEO)

  const members = server?.members.filter((member)=>member.profileId !== profile.id)

  const role = server?.members.find((member)=>member.profileId === profile.id)?.role
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ServerHeader server={server}
        role ={role}/>

        <ScrollArea className="flex-1 px-3">
          <div className="mt-2">
            <ServerSearch  data={
              [
                {
                  label:"Kênh chat",
                  type:"channel",
                  data: textChannel?.map((channel)=>(
                    {
                      id:channel.id,
                      name:channel.name,
                      icon:iconMap[channel.type]
                    }
                  ))
                },

                {
                  label:"Kênh thoại",
                  type:"channel",
                  data: audioChannel?.map((channel)=>(
                    {
                      id:channel.id,
                      name:channel.name,
                      icon:iconMap[channel.type]
                    }
                  ))
                },

                {
                  label:"Kênh video",
                  type:"channel",
                  data: videoChannel?.map((channel)=>(
                    {
                      id:channel.id,
                      name:channel.name,
                      icon:iconMap[channel.type]
                    }
                  ))
                },

                {
                  label:"Thành viên",
                  type:"member",
                  data: members?.map((member)=>(
                    {
                      id:member.id,
                      name:member.profile.name,
                      icon:roleIconMap[member.role]
                    }
                  ))
                }
              ]
            }/>
          </div>
        </ScrollArea>
    </div>
  )
};
