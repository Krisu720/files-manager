"use client";

import { FC, useState } from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";
interface LogoutProps {}

const Logout: FC<LogoutProps> = ({}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignOut = async () => {
    setLoading(true)
    await signOut()
    setLoading(false)
  }

  return (
    <Button size="sm" onClick={() => handleSignOut()} disabled={loading}>
      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Log out
    </Button>
  );
};

export default Logout;
