"use client";

import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Computer, Loader2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import useMounted from "@/hooks/use-mounted";

interface ThemeDropdownProps {}

const ThemeDropdown: FC<ThemeDropdownProps> = ({}) => {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {mounted ? (
            (theme === "light" && <Sun />) ||
            (theme === "dark" && <Moon />) ||
            (theme === "system" && <Computer />)
          ) : (
            <Loader2 className="animate-spin h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="flex gap-2"
          onClick={() => setTheme("light")}
        >
          <Sun /> Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-2"
          onClick={() => setTheme("dark")}
        >
          <Moon /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-2"
          onClick={() => setTheme("system")}
        >
          <Computer /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeDropdown;
