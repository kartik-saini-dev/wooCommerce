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
    <div className="flex min-h-screen flex-col">
      {navbar}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      {footer}
    </div>
  );
}
