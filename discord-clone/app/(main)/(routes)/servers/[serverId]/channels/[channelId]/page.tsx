import { ChatHeader } from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessenger from "@/components/chat/chat-messenger";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return auth().redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#2f3030] flex flex-col h-full">
      <ChatHeader
        serverId={params.serverId}
        name={channel.name}
        type="channel"
      />
      
      <ChatMessenger
      chatId={channel.id}
      member={member}
      name={channel.name}
      type="channel"
      apiUrl="/api/messages"
      socketUrl="/api/socket/messages"
      socketQuery={
        {
          channelId:channel.id, 
          serverId:channel.serverId
        }
      }
      paramKey="channelId"
      paramValue={channel.id}
      />
      
      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
      />
    </div>
  );
};

export default ChannelIdPage;
