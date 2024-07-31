import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

import { v4 as uuidv4 } from "uuid"


export async function PUT(req: Request, { params }: { params: { channelId: string } }) {
    try {
        const { name } = await req.json();
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if (!profile) {
            return NextResponse.json({ message: "Lỗi xác thực", status: false });
        }

        if (!serverId) {
            return NextResponse.json({ message: "Không tìm thấy server", status: false });
        }

        if (name === "general") {
            return NextResponse.json({ message: "Tên phải khác general", status: false });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATION]
                        }
                    }
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: params.channelId,
                            name: {
                                not: "general"
                            }
                        },
                        data: {
                            name,
                           
                        }
                    }
                }
            },
            include: {
                channels: true  
            }
        });

        if (!server) {
            return NextResponse.json({ message: "Server not found or you don't have permissions", status: false });
        }

        return NextResponse.json(server);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error", status: false });
    }
}


export async function DELETE(
    req: Request,
    { params }: { params: { channelId: string } }) {
    try {
        const profile = await currentProfile()
        const { searchParams } = new URL(req.url)
        const serverId = searchParams.get("serverId")
        if (!profile) {
            return new NextResponse("Lỗi xác thực", { status: 401 })
        }

        if(!params.channelId)
        {
            return new NextResponse("Lỗi không thấy id", { status: 404 })
        }

        if(!serverId)
        {
            return new NextResponse("Lỗi không thấy id", { status: 404 })
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
                    delete:{
                        id:params.channelId,
                        name:{
                            not:"general"
                        }
                    }
                }
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log(error)
    }
}
