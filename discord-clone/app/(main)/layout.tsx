import { NavigationSideBar } from "@/components/navigation/navigation-sidebar";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="h-full">
        {/* sidebar */}
        <div className="hidden md:flex h-full w-[72px]
        z-30 flex-col fixed inset-y-0
        ">
            <NavigationSideBar/>
        </div>
        {/* main container */}
        <main className="md:pl-[72px] h-full">
           <SocketProvider>
            <ModalProvider/>
            {children}
            </SocketProvider>
        </main>
      </div>
    );
  }