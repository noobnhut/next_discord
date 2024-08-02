import { currentProfilePages } from "@/lib/curent-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/type";
import { MemberRole } from "@prisma/client";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { content } = req.body;
    const { conversationId, directMessageId } = req.query;

    if (!conversationId) {
      return res.status(400).json({ error: "ID  not found." });
    }



    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            MemberOne: {
              profileId: profile?.id
            }
          },
          {
            MemberTwo: {
              profileId: profile?.id
            }
          }
        ]
      },
      include: {
        MemberOne: {
          include: {
            profile: true
          }
        },
        MemberTwo: {
          include: {
            profile: true
          }
        }
      }
    })


    if (!conversation) {
      return res.status(404).json({ error: "conversation not found" });
    }

    const member = conversation.MemberOne.profileId === profile?.id ? conversation.MemberOne : conversation.MemberTwo

    if (!member) {
      return res.status(400).json({ error: "member not found." });
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!directMessage) {
      return res.status(400).json({ error: "directMessage not found." });
    }
    const isMessageOwner = directMessage.memberId === member.id;
    const isAdmin = member.role == MemberRole.ADMIN;
    const isModeration = member.role == MemberRole.MODERATION;

    const canModify = isMessageOwner || isAdmin || isModeration;
    if (!canModify) {
      return res.status(400).json({ error: "khoong quyen han." });
    }
    if (req.method === "DELETE") {
      if (!isMessageOwner) {
        return res.status(400).json({ error: "khoong quyen han." });
      }
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
          conversationId: conversationId as string,
        },
        data: {
          fileUrl: null,
          content: "Tin nhan da xoa",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
    else {
      if (!isMessageOwner) {
        return res.status(400).json({ error: "khoong quyen han." });
      }
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
          conversationId: conversationId as string,
        },
        data: {
          content: content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
    const updateKey = `chat:${conversationId}:messages:update`;
    res.socket.server.io.emit(updateKey, directMessage);
    res.status(200).json(directMessage);
  } catch (error) {
    console.log(error);
  }
}
