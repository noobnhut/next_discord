import { currentProfilePages } from "@/lib/curent-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/type";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: req.method })
    }

    try {
        const profile = await currentProfilePages(req)
        const { content, fileUrl } = req.body
        const { conversationId } = req.query

        if (!conversationId) {
            return res.status(400).json({ error: "ID  not found." })
        }

        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        MemberOne: {
                            profileId: profile.id
                        }
                    },
                    {
                        MemberTwo: {
                            profileId: profile.id
                        }
                    }
                ]
            },
            include:{
                MemberOne:{
                    include:{
                        profile:true
                    }
                },
                MemberTwo:{
                    include:{
                        profile:true
                    }
                }
            }
        })

        
        if (!conversation) {
            return res.status(404).json({ error: "conversation not found" });
        }

        const member = conversation.MemberOne.profileId === profile.id ? conversation.MemberOne : conversation.MemberTwo

        if (!member) {
            return res.status(400).json({ error: "member not found." })
        }

        const message = await db.directMessage.create({
            data: {
                content,
                fileUrl,
                conversationId: conversationId as string,
                memberId: member.id
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })
        const channelKey = `chat:${conversationId}:messages`
        res.socket.server.io.emit(channelKey, message)
        res.status(200).json(message)
    } catch (error) {
        console.log(error)
    }
}