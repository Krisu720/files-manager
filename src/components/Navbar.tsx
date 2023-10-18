import { Share } from "lucide-react";
import { FC } from "react";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ThemeDropdown from "./ThemeDropdown";
import { getServerSession } from "next-auth";

interface NavbarProps {}

const Navbar = async ({}) => {
  const logged = await getServerSession();

  return (
    <div className="h-14 border-b bg-transparent backdrop-blur-lg sticky top-0">
      <div className="container flex items-center justify-between h-full">
        <Link href="/" className="text-xl flex gap-1 items-center">
          <Share className="h-5 w-5 text-primary" />
          Files Manager{" "}
        </Link>
        <div className="flex items-center gap-2">
          <ThemeDropdown />
          {logged ? (
            <Link href="/panel" className={cn(buttonVariants())}>
              Panel
            </Link>
          ) : (
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
