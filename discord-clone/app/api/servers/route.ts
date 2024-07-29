import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

import {v4 as uuidv4} from "uuid"
export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json()
        const profile = await currentProfile()

        if(!profile)
        {
            return new NextResponse("Lỗi xác thực",{status:401})
        }

        const check_name = await db.server.findFirst({where:{name}})
        if(check_name)
        {
           return NextResponse.json({message:"Trùng tên",status:false})
        }
        const server = await db.server.create({
            data:{
                profileId:profile.id,
                name,
                imageUrl,
                inviteCode:uuidv4(),
                channels:{
                    create:[
                        {name:"general",profileId:profile.id}
                    ]
                },
                members:{
                    create:{
                        profileId:profile.id,role:MemberRole.ADMIN
                    }
                }
            }
        })
        return NextResponse.json({server,status:true})
    } catch (error) {
        console.log("[SERVER_POST]", error)
        return new NextResponse("Lỗi")
    }
}