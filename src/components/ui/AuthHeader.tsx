"use client";

import { LogOut, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";

export function AuthHeader() {
  const router = useRouter();

  const handleLogout = () => {
    void signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <div className="fixed top-6 left-6 z-50">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push("/")}
        >
          <Home className="w-4 h-4" />
          Home
        </Button>
      </div>

      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <DarkModeToggle />
        <Button
          variant="secondary"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Log out
        </Button>
      </div>
    </>
  );
}
