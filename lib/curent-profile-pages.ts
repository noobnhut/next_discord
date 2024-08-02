
import { getAuth,auth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";
import { db } from "./db";
// trả về thông tin của 1 user
export const currentProfilePages = async (req:NextApiRequest) => {
    const { userId } =getAuth(req)
    
    if (!userId) {
        return null;
    }

    const profile = await db.profile.findUnique({
        where: {
            userId
        }
    })
    return profile
}