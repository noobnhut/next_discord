import { currentUser, auth} from "@clerk/nextjs/server";
import { db } from "./db";
// check profile
/*
 - tồn tại -> trả kq về
 - new => add vào csdl
*/
export const intitalProfile = async () => {
    const user = await currentUser();

    if (!user) {
        return auth().redirectToSignIn();
    }

    const profile = await db.profile.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (profile) {
        return profile;
    }

    const newProfile = await db.profile.create({
        data: {
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
        },
    });

    return newProfile;
};
