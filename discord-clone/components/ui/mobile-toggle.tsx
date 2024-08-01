import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "./button";
import { NavigationSideBar } from "../navigation/navigation-sidebar";
import { ServerSidebar } from "../server/server-sidebar";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

interface MobileToggleProp {
  serverId: string;
}
const MobileToggle = ({ serverId }: MobileToggleProp) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0 flex gap-0">
        
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">
          Enter your search query to find channels or members.
        </DialogDescription>

        <div className="w-[72px]">
          <NavigationSideBar />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
