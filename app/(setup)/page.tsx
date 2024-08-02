import { InitialModal } from "@/components/models/initial-model";
import { db } from "@/lib/db";
import { intitalProfile } from "@/lib/intital-profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {
 /*
  Lấy thông user từ intitalProfile
  check server đầu tiên của user
  => trả về server đó nếu có ?
 */
  const profileResponse = await intitalProfile();
    const server = await db.server.findFirst({
      where: {
        members: {
          some: {
            profileId: profileResponse.id,
          },
        },
      },
    });

    if(server)
    {
        redirect(`/servers/${server.id}`)
    }
    return (
        <InitialModal/>
    )
  
};

export default SetupPage;
