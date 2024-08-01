import { ChatHeader } from "@/components/chat/chat-header";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Conversation } from "@prisma/client";
interface ConversationIdPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
}

const ConversationIdPage = async ({ params }: ConversationIdPageProps) => {
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

  const memberOne = conversation.MemberOne
  const memberTwo = conversation.MemberTwo

  const otherMember = memberOne.profileId === profile.id ? memberTwo: memberOne


  return (
    <div className="bg-white dark:bg-[#213338] flex flex-col h-full">
      <ChatHeader
        serverId={params.serverId}
        name={otherMember.profile.name}
        imageUrl={otherMember.profile.imageUrl}
        type="conversation"
      />
    </div>
  );
};

export default ConversationIdPage;
