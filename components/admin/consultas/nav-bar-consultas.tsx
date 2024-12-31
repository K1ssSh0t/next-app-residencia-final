"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function NavBar() {
    const pathname = usePathname()

    return (
        <nav className="flex h-16 items-center border-b bg-background px-4">
            <div className="flex gap-6">
                <Link
                    href="/admin/consultas"
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname === "/admin/consultas"
                            ? "text-primary font-bold border-b-2 border-primary pb-1"
                            : "text-muted-foreground"
                    )}
                >
                    Buscar Superior
                </Link>
                <Link
                    href="consultas/medio-superior"
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname === "/admin/consultas/medio-superior"
                            ? "text-primary font-bold border-b-2 border-primary pb-1"
                            : "text-muted-foreground"
                    )}
                >
                    Buscar Medio Superior
                </Link>
            </div>
        </nav>
    )
}

