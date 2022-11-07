import { ReactNode, useEffect, useState } from "react";
import { Command } from "~/application/dtos/layout/Command";
import SidebarLayout from "../layouts/SidebarLayout";
import AppCommandPalette from "../ui/commandPalettes/AppCommandPalette";
import AdminCommandPalette from "../ui/commandPalettes/AdminCommandPalette";
import CommandPalette from "../ui/commandPalettes/CommandPalette";

interface Props {
    layout: "account" | "app" | "admin" | "home" | "docs";
    children: ReactNode;
    commands?: Command[]
}
export default function({ layout, children, commands }: Props) {
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  useEffect(() => {
    function onKeydown(event: any) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        setShowCommandPalette(true);
      }
    }
    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, []);

      
return (
    <div>
    
    <SidebarLayout layout={layout} onOpenCommandPalette={() => setShowCommandPalette(true)}>
      {children}
    </SidebarLayout>
    {layout === "account" ? (
      <AppCommandPalette isOpen={showCommandPalette} onClosed={() => setShowCommandPalette(false)} />
    ) : layout === "admin" ? (
      <AdminCommandPalette isOpen={showCommandPalette} onClosed={() => setShowCommandPalette(false)} />
    ) : layout === "home" ? (
      <AppCommandPalette isOpen={showCommandPalette} onClosed={() => setShowCommandPalette(false)} />
    ) : layout === "docs" && commands ? (
      <CommandPalette isOpen={showCommandPalette} onClosed={() => setShowCommandPalette(false)} commands={commands} />
    ) : (
      <div></div>
    )}
  </div>
)}