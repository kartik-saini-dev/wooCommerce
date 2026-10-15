"use client";

import { usePathname } from "next/navigation";

export function ConditionalLayout({ 
  children, 
  navbar, 
  footer 
}: { 
  children: React.ReactNode; 
  navbar: React.ReactNode; 
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="flex-1 flex flex-col">{children}</main>;
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      {navbar}
      <main className="flex-1 w-full">
        {children}
      </main>
      {footer}
    </div>
  );
}
