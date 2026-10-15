"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Package } from "lucide-react";
import { cn } from "@repo/services/utils";
import { siteConfig } from "@repo/ui/config/site";
import { Button } from "@repo/ui/components/ui/button";

export function Sidebar() {
  const [isOpen, setIsOpen] = React.useState(false);

  // Lock body scroll when sidebar is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-3 right-4 z-50">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle Menu">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 transform bg-white dark:bg-slate-950 border-r transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:static md:w-64 md:block md:hidden"
        )}
      >
        <div className="flex h-16 items-center px-6 border-b md:hidden">
          <Link href="/" className="flex items-center space-x-2" onClick={closeSidebar}>
            <Package className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg">{siteConfig.name}</span>
          </Link>
        </div>
        
        <nav className="flex flex-col gap-4 p-6">
          <div className="space-y-1">
            <h4 className="mb-2 text-sm font-semibold tracking-tight">Main Menu</h4>
            <Link
              href="/"
              onClick={closeSidebar}
              className="flex w-full items-center rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={closeSidebar}
              className="flex w-full items-center rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              Shop Parts
            </Link>
            <Link
              href="/services"
              onClick={closeSidebar}
              className="flex w-full items-center rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              Book Repair
            </Link>
          </div>
          
          <div className="space-y-1 mt-4">
            <h4 className="mb-2 text-sm font-semibold tracking-tight">Account</h4>
            <Link
              href="/login"
              onClick={closeSidebar}
              className="flex w-full items-center rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              Sign In
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
