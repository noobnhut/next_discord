import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

import { v4 as uuidv4 } from "uuid"

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }) {
    try {
        const profile = await currentProfile()

        if (!profile) {
            return new NextResponse("Lỗi xác thực", { status: 401 })
        }

        if (!params.serverId) {
            return new NextResponse("Lỗi không thấy id", { status: 404 })
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId:{
                    not:profile.id
                },
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
                    }
                }
            }
        });
        

        return NextResponse.json(server)
    } catch (error) {
        console.log(error)
    }
}
