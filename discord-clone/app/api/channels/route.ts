import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { channel } from "diagnostics_channel";
import { NextResponse } from "next/server";

import { v4 as uuidv4 } from "uuid"
export async function POST(req: Request) {
    try {
        const { name, type } = await req.json()
        const {searchParams} = new URL(req.url)
        const serverId = searchParams.get("serverId")

        const profile = await currentProfile()

        if (!serverId) {
            return  NextResponse.json({message:"Không thấy id", status: false })
        }

        if (!profile) {
            return  NextResponse.json({message:"Lỗi xác thực", status: false })

        }

        const check_name = await db.channel.findFirst({ where: { name } })
        if (check_name) {
            return NextResponse.json({ message: "Trùng tên", status: false })
        }
        const server = await db.server.update({
            where:{
                id:serverId,
                members:{
                    some:{
                        profileId:profile.id,
                        role:{
                            in:[MemberRole.ADMIN,MemberRole.MODERATION]
                        }
                    }
                }
                
            },
            data:{
                channels:{
                    create:{
                        profileId:profile.id,
                        name,
                        type
                    }
                }
            }
        })
        return NextResponse.json({ server, status: true })
    } catch (error) {
        console.log("[SERVER_POST]", error)
        return new NextResponse("Lỗi")
    }
}
