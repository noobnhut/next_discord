import { currentProfilePages } from "@/lib/curent-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/type";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    try {
        const profile = await currentProfilePages(req)
        const { content, fileUrl } = req.body
        const { serverId, channelId } = req.query

        if (!serverId) {
            return res.status(400).json({ error: "ID server not found." })
        }

        if (!channelId) {
            return res.status(400).json({ error: "ID channel not found." })
        }

        const server = await db.server.findFirst({
            where:{
                id:serverId as string,
                members:{
                    some:{
                        profileId: profile?.id
                    }
                }
            },
            include:{
                members:true
            }
        })

        if (!server) {
            return res.status(400).json({ error: "server not found." })
        }

        const channel = await db.channel.findFirst({
            where:{
                id:channelId as string,
                serverId:serverId as string
            }
        })

        if (!channel) {
            return res.status(400).json({ error: " channel not found." })
        }

        const member = server.members.find((member)=>member.profileId === profile?.id)

        if (!member) {
            return res.status(400).json({ error: "member not found." })
        }

        const message =await db.message.create({
            data:{
                content,
                fileUrl,
                channelId:channelId as string,
                memberId:member.id
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        })
        const channelKey = `chat:${channelId}:messages`
        res.socket.server.io.emit(channelKey,message)
        res.status(200).json(message)
    } catch (error) {
        console.log(error)
    }
}