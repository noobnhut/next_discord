import { ChatHeader } from "@/components/chat/chat-header";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Conversation } from "@prisma/client";
import ChatMessenge from "@/components/chat/chat-messenger";
import ChatInput from "@/components/chat/chat-input";
import MediaRoom from "@/components/ui/media-room";
interface ConversationIdPageProps {
  params: {
    serverId: string;
    memberId: string;
  },
  searchParams:{
    video?:boolean
  }
}

const ConversationIdPage = async ({ params ,searchParams}: ConversationIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return auth().redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });
  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );
  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const memberOne = conversation.MemberOne;
  const memberTwo = conversation.MemberTwo;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#213338] flex flex-col h-full">
      <ChatHeader
        serverId={params.serverId}
        name={otherMember.profile.name}
        imageUrl={otherMember.profile.imageUrl}
        type="conversation"
      />
      {searchParams.video && (
        <MediaRoom
        chatId={conversation.id} video={true} audio={true}
        />
      )}
      {!searchParams.video && (
        <>
         <ChatMessenge
        member={currentMember}
        name={otherMember.profile.name}
        chatId={conversation.id}
        type="conversation"
        apiUrl="/api/direct-messages"
        paramKey="conversationId"
        paramValue={conversation.id}
        socketUrl="/api/socket/direct-messages"
        socketQuery={{
          conversationId: conversation.id,
        }}
      />
      <ChatInput
        name={otherMember.profile.name}
        type="conversation"
        apiUrl="/api/socket/direct-messages"
        query={{
          conversationId: conversation.id,
        }}
      />
        </>
      )}
     
    </div>
  );
};

export default ConversationIdPage;
