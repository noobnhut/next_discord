
export default function AuthLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="flex items-center h-full justify-center">
            {children}
        </div>
    );
  }
  