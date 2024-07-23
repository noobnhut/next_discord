import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ui/model-toggle";
export default function Home() {
  return (
    <div>
      <UserButton
       afterSwitchSessionUrl="/"
      />
      <ModeToggle/>
    </div>
  );
}
