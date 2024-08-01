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
    const { serverId, channelId, messageId } = req.query;

    if (!serverId) {
      return res.status(400).json({ error: "ID server not found." });
    }

    if (!channelId) {
      return res.status(400).json({ error: "ID channel not found." });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile?.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(400).json({ error: "server not found." });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(400).json({ error: " channel not found." });
    }

    const member = server.members.find(
      (member) => member.profileId === profile?.id
    );

    if (!member) {
      return res.status(400).json({ error: "member not found." });
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message) {
      return res.status(400).json({ error: "message not found." });
    }
    const isMessageOwner = message.memberId === member.id;
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
      message = await db.message.update({
        where: {
          id: messageId as string,
          channelId: channelId as string,
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
    else
    {
        if (!isMessageOwner) {
            return res.status(400).json({ error: "khoong quyen han." });
          }
          message = await db.message.update({
            where: {
              id: messageId as string,
              channelId: channelId as string,
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
    const updateKey = `chat:${channelId}:messages`;
    res.socket.server.io.emit(updateKey, message);
    res.status(200).json(message);
  } catch (error) {
    console.log(error);
  }
}
