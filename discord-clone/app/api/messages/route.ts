import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { Message } from "@prisma/client"
import { NextResponse } from "next/server"
const MESSENGER_BATCH = 10
export async function GET(req:Request) {
    try {
        const profile = await currentProfile()
        const {searchParams} = new URL(req.url)
        const cursor = searchParams.get("cursor")
        const channelId = searchParams.get("channelId")

        if (!profile) {
            return new NextResponse("Lỗi xác thực", { status: 401 })
        }

        if (!channelId) {
            return new NextResponse("Không tìm thấy", { status: 401 })
        }

        let messages:Message[]=[]

        if(cursor)
        {
            messages = await db.message.findMany({
                take:MESSENGER_BATCH,
                skip:1,
                cursor:{
                    id:cursor
                },
                where:{
                    channelId
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                },
                orderBy:{
                    createdAt:"desc"
                },
             
            })
        }
        else
        {
            messages = await db.message.findMany({
                take:MESSENGER_BATCH,
                where:{
                    channelId
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                },
                orderBy:{
                    createdAt:"desc"
                },
             
            })
        }

        let nextCursor = null
        if(messages.length === MESSENGER_BATCH)
        {
            nextCursor = messages[MESSENGER_BATCH -1].id
        }
  
        return NextResponse.json(
            {
                items:messages,
                nextCursor
            }
        )
    } catch (error) {
        console.log(error)
    }
}